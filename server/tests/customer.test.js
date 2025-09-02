import request from "supertest";
import app from "../src/app.js";
import db from "../src/config/database.js";

beforeAll((done) => {
  db.serialize(() => {
    db.run("DELETE FROM addresses");
    db.run("DELETE FROM customers", done);
  });
});

describe("Customer API", () => {
  let customerId;

  it("should create a new customer", async () => {
    const res = await request(app)
      .post("/api/customers")
      .send({ firstName: "John", lastName: "Doe", phoneNumber: "9876543210" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    customerId = res.body.id;
  });

  it("should fetch all customers", async () => {
    const res = await request(app).get("/api/customers");
    expect(res.statusCode).toBe(200);
    expect(res.body.customers.length).toBeGreaterThan(0);
  });

  it("should fetch customer by ID", async () => {
    const res = await request(app).get(`/api/customers/${customerId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.customer.first_name).toBe("John");
  });

  it("should update a customer", async () => {
    const res = await request(app)
      .put(`/api/customers/${customerId}`)
      .send({
        firstName: "Johnny",
        lastName: "Doe",
        phoneNumber: "9876543210",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Customer updated successfully");
  });

  it("should delete a customer", async () => {
    const res = await request(app).delete(`/api/customers/${customerId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Customer deleted successfully");
  });
});
