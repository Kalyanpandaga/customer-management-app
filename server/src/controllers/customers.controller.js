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

export async function createCustomerController(req, res, next) {
  try {
    const { firstName, lastName, phoneNumber } = req.body;
    const id = await createCustomer({ firstName, lastName, phoneNumber });
    res.status(201).json({ message: "Customer created successfully", id });
  } catch (err) {
    next(err);
  }
}

export async function getAllCustomersController(req, res, next) {
  try {
    const {
      city,
      state,
      pinCode,
      page = 1,
      limit = 10,
      sort = "ASC",
    } = req.query;
    const searchParams = {};
    if (city) searchParams.city = city;
    if (state) searchParams.state = state;
    if (pinCode) searchParams.pinCode = pinCode;

    const customers = await getAllCustomers({
      searchParams,
      page: Number(page),
      limit: Number(limit),
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
    const { firstName, lastName, phoneNumber } = req.body;
    const customer = await getCustomerById(customerId);
    if (!customer) {
      return errorResponse(
        res,
        404,
        "CUSTOMER_NOT_FOUND",
        "customer not found"
      );
    }
    const changes = await updateCustomer(customerId, {
      firstName,
      lastName,
      phoneNumber,
    });
    if (!changes) {
      return errorResponse(
        res,
        404,
        "CUSTOMER_NOT_FOUND",
        "customer not found"
      );
    }
    res.json({ message: "Customer updated successfully" });
  } catch (err) {
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
