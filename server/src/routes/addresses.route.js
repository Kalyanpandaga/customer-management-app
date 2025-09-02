import express from "express";
import validateRequest from "../middlewares/validate.middleware.js";
import errorMiddleware from "../middlewares/error.middleware.js";
import {
  validateCreateAddressData,
  validateUpdateAddressData,
} from "../validations/addressData.validation.js";
import {
  addAddressToCustomerController,
  getAllCustomerAddressesController,
  getAddressByIdController,
  updateAddressByIdController,
  deleteAddressByIdController,
} from "../controllers/addresses.controller.js";

const router = express.Router();

router.post(
  "/:customerId",
  validateRequest(validateCreateAddressData),
  addAddressToCustomerController
);
router.get("/:customerId", getAllCustomerAddressesController);
router.get("/details/:addressId", getAddressByIdController);
router.put(
  "/:addressId",
  validateRequest(validateUpdateAddressData),
  updateAddressByIdController
);
router.delete("/:addressId", deleteAddressByIdController);

export default router;
