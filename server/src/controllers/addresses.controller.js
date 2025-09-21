import {
  addAddressToCustomer,
  getAllCustomerAddresses,
  getAddressById,
  updateAddressById,
  deleteAddressById,
} from "../services/db.service.js";
import { errorResponse } from "../utils/errorResponse.js";
import {
  validateCreateAddressData,
  validateUpdateAddressData,
} from "../validations/addressData.validation.js";

export async function addAddressToCustomerController(req, res, next) {
  try {
    const { customerId } = req.params;
    const validatedData = validateCreateAddressData({
      customerId: Number(customerId),
      ...req.body,
    });
    const id = await addAddressToCustomer(validatedData);
    res.status(201).json({ message: "Address added successfully", id });
  } catch (err) {
    if (err.message.includes("FOREIGN KEY constraint failed")) {
      return errorResponse(
        res,
        404,
        "CUSTOMER_NOT_FOUND",
        "Customer not found"
      );
    }
    next(err);
  }
}

export async function getAllCustomerAddressesController(req, res, next) {
  try {
    const { customerId } = req.params;
    const addresses = await getAllCustomerAddresses(Number(customerId));
    res.json({ addresses });
  } catch (err) {
    next(err);
  }
}

export async function getAddressByIdController(req, res, next) {
  try {
    const { addressId } = req.params;
    const address = await getAddressById(Number(addressId));
    if (!address)
      return errorResponse(res, 404, "ADDRESS_NOT_FOUND", "address not found");
    res.json({ address });
  } catch (err) {
    next(err);
  }
}

export async function updateAddressByIdController(req, res, next) {
  try {
    const { addressId } = req.params;
    const validatedData = validateUpdateAddressData(req.body);

    const address = await getAddressById(Number(addressId));
    if (!address)
      return errorResponse(res, 404, "ADDRESS_NOT_FOUND", "Address not found");

    await updateAddressById(Number(addressId), validatedData);
    res.json({ message: "Address updated successfully" });
  } catch (err) {
    next(err);
  }
}

export async function deleteAddressByIdController(req, res, next) {
  try {
    const { addressId } = req.params;
    const address = await getAddressById(Number(addressId));
    if (!address)
      return errorResponse(res, 404, "ADDRESS_NOT_FOUND", "address not found");
    await deleteAddressById(Number(addressId));
    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    next(err);
  }
}
