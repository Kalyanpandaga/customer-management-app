import request from "supertest";
import app from "../src/app.js";
import db from "../src/config/database.js";

let customerId, addressId;

beforeAll((done) => {
  db.serialize(() => {
    db.run("DELETE FROM addresses");
    db.run("DELETE FROM customers");
    db.run(
      "INSERT INTO customers (first_name,last_name,phone_number) VALUES (?,?,?)",
      ["Jane", "Doe", "9999999999"],
      function (err) {
        customerId = this.lastID;
        done();
      }
    );
  });
});

afterAll((done) => {
  db.close(done);
});

describe("Address API", () => {
  describe("POST /api/addresses/:customerId", () => {
    it("should add address to customer with valid data", async () => {
      const addressData = {
        addressDetails: "123 Main Street, Apartment 4B",
        city: "Pune",
        state: "Maharashtra",
        pinCode: "411001",
      };

      const res = await request(app)
        .post(`/api/addresses/${customerId}`)
        .send(addressData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.message).toBe("Address added successfully");
      addressId = res.body.id;
    });

    it("should reject address with invalid data", async () => {
      const invalidData = {
        addressDetails: "123", // Too short
        city: "Pune",
        state: "MH",
        pinCode: "411001",
      };

      const res = await request(app)
        .post(`/api/addresses/${customerId}`)
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.errorCode).toBe("VALIDATION_ERROR");
    });

    it("should reject address with invalid PIN code", async () => {
      const invalidData = {
        addressDetails: "123 Main Street",
        city: "Pune",
        state: "MH",
        pinCode: "123", // Too short
      };

      const res = await request(app)
        .post(`/api/addresses/${customerId}`)
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.errorCode).toBe("VALIDATION_ERROR");
    });

    it("should reject address for non-existent customer", async () => {
      const addressData = {
        addressDetails: "123 Main Street",
        city: "Pune",
        state: "MH",
        pinCode: "411001",
      };

      const res = await request(app)
        .post("/api/addresses/99999")
        .send(addressData);

      expect(res.statusCode).toBe(404);
      expect(res.body.errorCode).toBe("CUSTOMER_NOT_FOUND");
    });
  });

  describe("GET /api/addresses/:customerId", () => {
    it("should get all addresses for customer", async () => {
      const res = await request(app).get(`/api/addresses/${customerId}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.addresses)).toBe(true);
      expect(res.body.addresses.length).toBeGreaterThan(0);
    });

    it("should return empty array for customer with no addresses", async () => {
      // Create another customer without addresses
      const customerRes = await request(app).post("/api/customers").send({
        firstName: "John",
        lastName: "Smith",
        phoneNumber: "9876543210",
      });

      const res = await request(app).get(
        `/api/addresses/${customerRes.body.id}`
      );
      expect(res.statusCode).toBe(200);
      expect(res.body.addresses).toEqual([]);
    });
  });

  describe("GET /api/addresses/details/:addressId", () => {
    it("should get address by ID", async () => {
      const res = await request(app).get(`/api/addresses/details/${addressId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.address).toHaveProperty("id", addressId);
    });

    it("should return 404 for non-existent address", async () => {
      const res = await request(app).get("/api/addresses/details/99999");
      expect(res.statusCode).toBe(404);
      expect(res.body.errorCode).toBe("ADDRESS_NOT_FOUND");
    });
  });

  describe("PUT /api/addresses/:addressId", () => {
    it("should update address with valid data", async () => {
      const updateData = {
        addressDetails: "456 Oak Avenue, Suite 200",
        city: "Mumbai",
        state: "Maharashtra",
        pinCode: "400001",
      };

      const res = await request(app)
        .put(`/api/addresses/${addressId}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Address updated successfully");
    });

    it("should reject update with invalid data", async () => {
      const invalidData = {
        addressDetails: "123", // Too short
        city: "Mumbai",
        state: "MH",
        pinCode: "400001",
      };

      const res = await request(app)
        .put(`/api/addresses/${addressId}`)
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(res.body.errorCode).toBe("VALIDATION_ERROR");
    });

    it("should return 404 for non-existent address", async () => {
      const res = await request(app)
        .put("/api/addresses/99999")
        .send({ addressDetails: "123 Test St" });

      expect(res.statusCode).toBe(404);
      expect(res.body.errorCode).toBe("ADDRESS_NOT_FOUND");
    });

    it("should allow partial updates", async () => {
      const partialData = {
        city: "Delhi",
      };

      const res = await request(app)
        .put(`/api/addresses/${addressId}`)
        .send(partialData);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Address updated successfully");
    });
  });

  describe("DELETE /api/addresses/:addressId", () => {
    it("should delete address", async () => {
      const res = await request(app).delete(`/api/addresses/${addressId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Address deleted successfully");
    });

    it("should return 404 for non-existent address", async () => {
      const res = await request(app).delete("/api/addresses/99999");
      expect(res.statusCode).toBe(404);
      expect(res.body.errorCode).toBe("ADDRESS_NOT_FOUND");
    });
  });
});
