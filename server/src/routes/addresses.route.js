import express from "express";
import {
  addAddressToCustomerController,
  getAllCustomerAddressesController,
  getAddressByIdController,
  updateAddressByIdController,
  deleteAddressByIdController,
} from "../controllers/addresses.controller.js";

const router = express.Router();

router.post("/:customerId", addAddressToCustomerController);
router.get("/:customerId", getAllCustomerAddressesController);
router.get("/details/:addressId", getAddressByIdController);
router.put("/:addressId", updateAddressByIdController);
router.delete("/:addressId", deleteAddressByIdController);

export default router;
