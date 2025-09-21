import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomersWithOneAddress,
  getCustomersWithMultipleAddresses,
} from "../services/db.service.js";
import { errorResponse } from "../utils/errorResponse.js";
import {
  validateCreateCustomerData,
  validateUpdateCustomerData,
  validateSearchParams,
} from "../validations/customerData.validation.js";

export async function createCustomerController(req, res, next) {
  try {
    const validatedData = validateCreateCustomerData(req.body);
    const id = await createCustomer(validatedData);
    res.status(201).json({ message: "Customer created successfully", id });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return errorResponse(
        res,
        409,
        "DUPLICATE_PHONE",
        "Phone number already exists"
      );
    }
    next(err);
  }
}

export async function getAllCustomersController(req, res, next) {
  try {
    const validatedParams = validateSearchParams(req.query);
    const { city, state, pinCode, page, limit, sort, search } = validatedParams;

    const searchParams = {};
    if (city) searchParams.city = city;
    if (state) searchParams.state = state;
    if (pinCode) searchParams.pinCode = pinCode;
    if (search) searchParams.search = search;

    const customers = await getAllCustomers({
      searchParams,
      page,
      limit,
      sort,
    });
    res.json({ customers });
  } catch (err) {
    next(err);
  }
}

export async function getCustomerByIdController(req, res, next) {
  try {
    const { customerId } = req.params;
    const customer = await getCustomerById(customerId);
    if (!customer) {
      return errorResponse(
        res,
        404,
        "CUSTOMER_NOT_FOUND",
        "customer not found"
      );
    }
    res.json({ customer });
  } catch (err) {
    next(err);
  }
}
export async function updateCustomerController(req, res, next) {
  try {
    const { customerId } = req.params;
    const validatedData = validateUpdateCustomerData(req.body);

    const customer = await getCustomerById(customerId);
    if (!customer) {
      return errorResponse(
        res,
        404,
        "CUSTOMER_NOT_FOUND",
        "Customer not found"
      );
    }

    const changes = await updateCustomer(customerId, validatedData);
    if (!changes) {
      return errorResponse(
        res,
        404,
        "CUSTOMER_NOT_FOUND",
        "Customer not found"
      );
    }
    res.json({ message: "Customer updated successfully" });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return errorResponse(
        res,
        409,
        "DUPLICATE_PHONE",
        "Phone number already exists"
      );
    }
    next(err);
  }
}

export async function deleteCustomerController(req, res, next) {
  try {
    const { customerId } = req.params;
    const customer = await getCustomerById(customerId);
    if (!customer) {
      return errorResponse(
        res,
        404,
        "CUSTOMER_NOT_FOUND",
        "customer not found"
      );
    }
    await deleteCustomer(customerId);
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    next(err);
  }
}

export async function getCustomersWithOneAddressController(req, res, next) {
  try {
    const customers = await getCustomersWithOneAddress();
    res.json({ customers });
  } catch (err) {
    next(err);
  }
}

export async function getCustomersWithMultipleAddressesController(
  req,
  res,
  next
) {
  try {
    const customers = await getCustomersWithMultipleAddresses();
    res.json({ customers });
  } catch (err) {
    next(err);
  }
}
