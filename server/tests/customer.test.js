import request from "supertest";
import app from "../src/app.js";
import db from "../src/config/database.js";

beforeAll((done) => {
  db.serialize(() => {
    db.run("DELETE FROM addresses");
    db.run("DELETE FROM customers", done);
  });
});

afterAll((done) => {
  db.close(done);
});

describe("Customer API", () => {
  let customerId;

  describe("POST /api/customers", () => {
    it("should create a new customer with valid data", async () => {
      const customerData = {
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "9876543210",
      };

      const res = await request(app).post("/api/customers").send(customerData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.message).toBe("Customer created successfully");
      customerId = res.body.id;
    });

    it("should reject customer with invalid first name", async () => {
      const invalidData = {
        firstName: "J", // Too short
        lastName: "Doe",
        phoneNumber: "9876543210",
      };

      const res = await request(app).post("/api/customers").send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.errorCode).toBe("VALIDATION_ERROR");
    });

    it("should reject customer with invalid phone number", async () => {
      const invalidData = {
        firstName: "Jane",
        lastName: "Smith",
        phoneNumber: "123", // Too short
      };

      const res = await request(app).post("/api/customers").send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.errorCode).toBe("VALIDATION_ERROR");
    });

    it("should reject duplicate phone number", async () => {
      const duplicateData = {
        firstName: "Jane",
        lastName: "Smith",
        phoneNumber: "9876543210", // Same as existing
      };

      const res = await request(app).post("/api/customers").send(duplicateData);

      expect(res.statusCode).toBe(409);
      expect(res.body.errorCode).toBe("DUPLICATE_PHONE");
    });

    it("should reject customer with special characters in name", async () => {
      const invalidData = {
        firstName: "John@123",
        lastName: "Doe",
        phoneNumber: "9876543211",
      };

      const res = await request(app).post("/api/customers").send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.errorCode).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /api/customers", () => {
    it("should fetch all customers", async () => {
      const res = await request(app).get("/api/customers");
      expect(res.statusCode).toBe(200);
      expect(res.body.customers.length).toBeGreaterThan(0);
    });

    it("should support pagination", async () => {
      const res = await request(app)
        .get("/api/customers")
        .query({ page: 1, limit: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.customers.length).toBeLessThanOrEqual(5);
    });

    it("should support search by name", async () => {
      const res = await request(app)
        .get("/api/customers")
        .query({ search: "John" });

      expect(res.statusCode).toBe(200);
      expect(
        res.body.customers.some((c) => c.first_name.includes("John"))
      ).toBe(true);
    });

    it("should support search by phone", async () => {
      const res = await request(app)
        .get("/api/customers")
        .query({ search: "9876543210" });

      expect(res.statusCode).toBe(200);
      expect(
        res.body.customers.some((c) => c.phone_number.includes("9876543210"))
      ).toBe(true);
    });

    it("should support sorting", async () => {
      const res = await request(app)
        .get("/api/customers")
        .query({ sort: "desc" });

      expect(res.statusCode).toBe(200);
      const names = res.body.customers.map((c) => c.first_name);
      const sortedNames = [...names].sort().reverse();
      expect(names).toEqual(sortedNames);
    });

    it("should validate search parameters", async () => {
      const res = await request(app).get("/api/customers").query({ page: -1 });

      expect(res.statusCode).toBe(400);
      expect(res.body.errorCode).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /api/customers/:id", () => {
    it("should fetch customer by ID", async () => {
      const res = await request(app).get(`/api/customers/${customerId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.customer.first_name).toBe("John");
    });

    it("should return 404 for non-existent customer", async () => {
      const res = await request(app).get("/api/customers/99999");
      expect(res.statusCode).toBe(404);
      expect(res.body.errorCode).toBe("CUSTOMER_NOT_FOUND");
    });

    it("should return 400 for invalid customer ID", async () => {
      const res = await request(app).get("/api/customers/invalid");
      expect(res.statusCode).toBe(400);
    });
  });

  describe("PUT /api/customers/:id", () => {
    it("should update a customer with valid data", async () => {
      const updateData = {
        firstName: "Johnny",
        lastName: "Doe",
        phoneNumber: "9876543210",
      };

      const res = await request(app)
        .put(`/api/customers/${customerId}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Customer updated successfully");
    });

    it("should reject update with invalid data", async () => {
      const invalidData = {
        firstName: "J", // Too short
        lastName: "Doe",
      };

      const res = await request(app)
        .put(`/api/customers/${customerId}`)
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.errorCode).toBe("VALIDATION_ERROR");
    });

    it("should return 404 for non-existent customer", async () => {
      const res = await request(app)
        .put("/api/customers/99999")
        .send({ firstName: "Test" });

      expect(res.statusCode).toBe(404);
      expect(res.body.errorCode).toBe("CUSTOMER_NOT_FOUND");
    });
  });

  describe("DELETE /api/customers/:id", () => {
    it("should delete a customer", async () => {
      const res = await request(app).delete(`/api/customers/${customerId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Customer deleted successfully");
    });

    it("should return 404 for non-existent customer", async () => {
      const res = await request(app).delete("/api/customers/99999");
      expect(res.statusCode).toBe(404);
      expect(res.body.errorCode).toBe("CUSTOMER_NOT_FOUND");
    });
  });

  describe("GET /api/customers/one-address/list", () => {
    it("should fetch customers with one address", async () => {
      const res = await request(app).get("/api/customers/one-address/list");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.customers)).toBe(true);
    });
  });

  describe("GET /api/customers/multiple-address/list", () => {
    it("should fetch customers with multiple addresses", async () => {
      const res = await request(app).get(
        "/api/customers/multiple-address/list"
      );
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.customers)).toBe(true);
    });
  });
});
