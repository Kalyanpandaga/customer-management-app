import validator from "validator";

export function validateCreateAddressData(data) {
  const { customerId, addressDetails, city, state, pinCode } = data;
  if (!customerId || typeof customerId !== "number") {
    throw new Error("Customer ID is required and must be a number.");
  }
  if (
    !addressDetails ||
    addressDetails.length < 5 ||
    addressDetails.length > 100
  ) {
    throw new Error(
      "Address details are required and must be between 5 and 100 characters."
    );
  }
  if (!city || city.length < 2 || city.length > 50) {
    throw new Error(
      "City is required and must be between 2 and 50 characters."
    );
  }
  if (!state || state.length < 2 || state.length > 50) {
    throw new Error(
      "State is required and must be between 2 and 50 characters."
    );
  }
  if (!pinCode || !validator.isPostalCode(pinCode + "", "IN")) {
    throw new Error("A valid pin code is required.");
  }
}

export function validateUpdateAddressData(data) {
  const allowedFields = ["addressDetails", "city", "state", "pinCode"];
  for (const field of Object.keys(data)) {
    if (!allowedFields.includes(field)) {
      throw new Error(`Invalid field: ${field}`);
    }
    if (
      field === "addressDetails" &&
      (data[field].length < 5 || data[field].length > 100)
    ) {
      throw new Error(
        "Address details must be between 5 and 100 characters if provided."
      );
    }
    if (
      field === "city" &&
      (data[field].length < 2 || data[field].length > 50)
    ) {
      throw new Error("City must be between 2 and 50 characters if provided.");
    }
    if (
      field === "state" &&
      (data[field].length < 2 || data[field].length > 50)
    ) {
      throw new Error("State must be between 2 and 50 characters if provided.");
    }
    if (
      field === "pinCode" &&
      !validator.isPostalCode(data[field] + "", "IN")
    ) {
      throw new Error("Pin code must be valid if provided.");
    }
  }
}
