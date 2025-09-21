import express from "express";
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

  createCustomerController
);
router.get("/", getAllCustomersController);
router.get("/:customerId", getCustomerByIdController);
router.put("/:customerId", updateCustomerController);
router.delete("/:customerId", deleteCustomerController);
router.get("/one-address/list", getCustomersWithOneAddressController);
router.get(
  "/multiple-address/list",
  getCustomersWithMultipleAddressesController
);

export default router;
