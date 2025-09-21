import db from "../config/database.js";

// Helper for running SQL with async/await
function runSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function getSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export async function createCustomer({ firstName, lastName, phoneNumber }) {
  const sql = `INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)`;
  const result = await runSql(sql, [firstName, lastName, phoneNumber]);
  return result.lastID;
}

export async function getAllCustomers({
  searchParams = {},
  page = 1,
  limit = 10,
  sort = "ASC",
}) {
  const params = [];
  const filters = [];

  let sql = `
    SELECT DISTINCT c.id, c.first_name, c.last_name, c.phone_number,
           COUNT(a.id) as address_count
    FROM customers c 
    LEFT JOIN addresses a ON c.id = a.customer_id
  `;

  // Filtering
  const allowedFilters = {
    city: "a.city",
    state: "a.state",
    pinCode: "a.pin_code",
  };

  for (const [key, value] of Object.entries(searchParams)) {
    if (allowedFilters[key] && value) {
      filters.push(`${allowedFilters[key]} LIKE ?`);
      params.push(`%${value}%`);
    }
  }

  // Search by name or phone
  if (searchParams.search) {
    const searchFilters = [];
    searchFilters.push(
      `(c.first_name LIKE ? OR c.last_name LIKE ? OR c.phone_number LIKE ?)`
    );
    params.push(
      `%${searchParams.search}%`,
      `%${searchParams.search}%`,
      `%${searchParams.search}%`
    );
    filters.push(...searchFilters);
  }

  if (filters.length > 0) sql += " WHERE " + filters.join(" AND ");

  // Group by customer to get address count
  sql += " GROUP BY c.id, c.first_name, c.last_name, c.phone_number";

  // Sorting & Pagination
  sql += ` ORDER BY c.first_name ${
    sort.toUpperCase() === "DESC" ? "DESC" : "ASC"
  } LIMIT ? OFFSET ?`;
  params.push(limit, (page - 1) * limit);

  return await allSql(sql, params);
}

export async function getCustomerById(customerId) {
  const sql = `SELECT * FROM customers WHERE id = ?`;
  return await getSql(sql, [customerId]);
}

export async function updateCustomer(
  customerId,
  { firstName, lastName, phoneNumber }
) {
  const sql = `UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?`;
  const result = await runSql(sql, [
    firstName,
    lastName,
    phoneNumber,
    customerId,
  ]);
  return result.changes;
}

export async function deleteCustomer(customerId) {
  await runSql(`DELETE FROM addresses WHERE customer_id = ?`, [customerId]);
  const result = await runSql(`DELETE FROM customers WHERE id = ?`, [
    customerId,
  ]);
  return result.changes;
}

// Addresses CRUD
export async function addAddressToCustomer({
  customerId,
  addressDetails,
  city,
  state,
  pinCode,
}) {
  const sql = `INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)`;
  const result = await runSql(sql, [
    customerId,
    addressDetails,
    city,
    state,
    pinCode,
  ]);
  return result.lastID;
}

export async function getAllCustomerAddresses(customerId) {
  const sql = `SELECT * FROM addresses WHERE customer_id = ?`;
  return await allSql(sql, [customerId]);
}

export async function getAddressById(addressId) {
  const sql = `SELECT * FROM addresses WHERE id = ?`;
  return await getSql(sql, [addressId]);
}

export async function updateAddressById(
  addressId,
  { addressDetails, city, state, pinCode }
) {
  const sql = `UPDATE addresses SET address_details = ?, city = ?, state = ?, pin_code = ? WHERE id = ?`;
  const result = await runSql(sql, [
    addressDetails,
    city,
    state,
    pinCode,
    addressId,
  ]);
  return result.changes;
}

export async function deleteAddressById(addressId) {
  const sql = `DELETE FROM addresses WHERE id = ?`;
  const result = await runSql(sql, [addressId]);
  return result.changes;
}

// Utility for only-one/multiple address
export async function getCustomersWithOneAddress() {
  const sql = `
    SELECT customers.*, COUNT(addresses.id) AS address_count
    FROM customers
    LEFT JOIN addresses ON customers.id = addresses.customer_id
    GROUP BY customers.id
    HAVING address_count = 1
  `;
  return await allSql(sql, []);
}

export async function getCustomersWithMultipleAddresses() {
  const sql = `
    SELECT customers.*, COUNT(addresses.id) AS address_count
    FROM customers
    LEFT JOIN addresses ON customers.id = addresses.customer_id
    GROUP BY customers.id
    HAVING address_count > 1
  `;
  return await allSql(sql, []);
}
