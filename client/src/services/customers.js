import { api } from "../lib/axios";

export async function listCustomers({
  page = 1,
  limit = 10,
  sort = "ASC",
  city = "",
  state = "",
  pinCode = "",
  search = "",
}) {
  const params = { page, limit, sort };
  if (city) params.city = city;
  if (state) params.state = state;
  if (pinCode) params.pinCode = pinCode;
  if (search) params.search = search;
  const { data } = await api.get("/api/customers", { params });
  return data.customers;
}

export async function getCustomer(id) {
  const { data } = await api.get(`/api/customers/${id}`);
  return data.customer;
}

export async function createCustomer(payload) {
  const { data } = await api.post("/api/customers", payload);
  return data;
}

export async function updateCustomer(id, payload) {
  const { data } = await api.put(`/api/customers/${id}`, payload);
  return data;
}

export async function deleteCustomer(id) {
  const { data } = await api.delete(`/api/customers/${id}`);
  return data;
}

export async function listOneAddressCustomers() {
  const { data } = await api.get("/api/customers/one-address/list");
  return data.customers;
}

export async function listMultipleAddressCustomers() {
  const { data } = await api.get("/api/customers/multiple-address/list");
  return data.customers;
}
