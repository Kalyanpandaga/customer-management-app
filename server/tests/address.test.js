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

describe("Address API", () => {
  it("should add address to customer", async () => {
    const res = await request(app).post(`/api/addresses/${customerId}`).send({
      customerId,
      addressDetails: "123 Street",
      city: "Pune",
      state: "MH",
      pinCode: "411001",
    });
    expect(res.statusCode).toBe(201);
    addressId = res.body.id;
  });

  it("should get all addresses for customer", async () => {
    const res = await request(app).get(`/api/addresses/${customerId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.addresses.length).toBeGreaterThan(0);
  });

  it("should update address", async () => {
    const res = await request(app).put(`/api/addresses/${addressId}`).send({
      addressDetails: "456 Avenue",
      city: "Mumbai",
      state: "MH",
      pinCode: "400001",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Address updated successfully");
  });

  it("should delete address", async () => {
    const res = await request(app).delete(`/api/addresses/${addressId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Address deleted successfully");
  });
});
