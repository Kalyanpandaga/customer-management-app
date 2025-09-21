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

// Helper to check valid integer ID
function isValidId(id) {
  return /^\d+$/.test(id) && Number(id) > 0;
}

export async function addAddressToCustomerController(req, res, next) {
  try {
    const { customerId } = req.params;
    if (!isValidId(customerId)) {
      return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid customer ID");
    }
    let validatedData;
    try {
      validatedData = validateCreateAddressData({
        customerId: Number(customerId),
        ...req.body,
      });
    } catch (err) {
      return errorResponse(res, 400, "VALIDATION_ERROR", err.message);
    }

    // Check if customer exists
    const customer = await import("../services/db.service.js").then((mod) =>
      mod.getCustomerById(customerId)
    );
    if (!customer) {
      return errorResponse(
        res,
        404,
        "CUSTOMER_NOT_FOUND",
        "Customer not found"
      );
    }

    const id = await addAddressToCustomer(validatedData);
    res.status(201).json({ message: "Address added successfully", id });
  } catch (err) {
    next(err);
  }
}

export async function getAllCustomerAddressesController(req, res, next) {
  try {
    const { customerId } = req.params;
    if (!isValidId(customerId)) {
      return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid customer ID");
    }
    const addresses = await getAllCustomerAddresses(Number(customerId));
    res.json({ addresses });
  } catch (err) {
    next(err);
  }
}

export async function getAddressByIdController(req, res, next) {
  try {
    const { addressId } = req.params;
    if (!isValidId(addressId)) {
      return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid address ID");
    }
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
    if (!isValidId(addressId)) {
      return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid address ID");
    }
    let validatedData;
    try {
      validatedData = validateUpdateAddressData(req.body);
    } catch (err) {
      return errorResponse(res, 400, "VALIDATION_ERROR", err.message);
    }

    // Get existing address for partial update
    const address = await getAddressById(Number(addressId));
    if (!address)
      return errorResponse(res, 404, "ADDRESS_NOT_FOUND", "Address not found");

    // Merge fields for partial update
    const mergedData = {
      addressDetails: validatedData.addressDetails ?? address.address_details,
      city: validatedData.city ?? address.city,
      state: validatedData.state ?? address.state,
      pinCode: validatedData.pinCode ?? address.pin_code,
    };

    await updateAddressById(Number(addressId), mergedData);
    res.json({ message: "Address updated successfully" });
  } catch (err) {
    next(err);
  }
}

export async function deleteAddressByIdController(req, res, next) {
  try {
    const { addressId } = req.params;
    if (!isValidId(addressId)) {
      return errorResponse(res, 400, "VALIDATION_ERROR", "Invalid address ID");
    }
    const address = await getAddressById(Number(addressId));
    if (!address)
      return errorResponse(res, 404, "ADDRESS_NOT_FOUND", "address not found");
    await deleteAddressById(Number(addressId));
    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    next(err);
  }
}
