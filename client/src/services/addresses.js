import { api } from "../lib/axios";

export async function listAddresses(customerId) {
  const { data } = await api.get(`/api/addresses/${customerId}`);
  return data.addresses;
}

export async function getAddress(addressId) {
  const { data } = await api.get(`/api/addresses/details/${addressId}`);
  return data.address;
}

export async function createAddress(customerId, payload) {
  const { data } = await api.post(`/api/addresses/${customerId}`, {
    customerId: Number(customerId),
    ...payload,
  });
  return data;
}

export async function updateAddress(addressId, payload) {
  const { data } = await api.put(`/api/addresses/${addressId}`, payload);
  return data;
}

export async function deleteAddress(addressId) {
  const { data } = await api.delete(`/api/addresses/${addressId}`);
  return data;
}
