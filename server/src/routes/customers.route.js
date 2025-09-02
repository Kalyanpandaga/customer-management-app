import express from "express";
import validateRequest from "../middlewares/validate.middleware.js";
import errorMiddleware from "../middlewares/error.middleware.js";
import {
  validateCreateCustomerData,
  validateUpdateCustomerData,
} from "../validations/customerData.validation.js";
import {
  createCustomerController,
  getAllCustomersController,
  getCustomerByIdController,
  updateCustomerController,
  deleteCustomerController,
  getCustomersWithOneAddressController,
  getCustomersWithMultipleAddressesController,
} from "../controllers/customers.controller.js";

const router = express.Router();

router.post(
  "/",
  validateRequest(validateCreateCustomerData),
  createCustomerController
);
router.get("/", getAllCustomersController);
router.get("/:customerId", getCustomerByIdController);
router.put(
  "/:customerId",
  validateRequest(validateUpdateCustomerData),
  updateCustomerController
);
router.delete("/:customerId", deleteCustomerController);
router.get("/one-address/list", getCustomersWithOneAddressController);
router.get(
  "/multiple-address/list",
  getCustomersWithMultipleAddressesController
);

router.use(errorMiddleware);

export default router;
