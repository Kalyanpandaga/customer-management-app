import validator from "validator";

export function validateCreateCustomerData(data) {
  const { firstName, lastName, phoneNumber } = data;
  if (!firstName || firstName.length < 2 || firstName.length > 30) {
    throw new Error(
      "First name is required and must be between 2 and 30 characters."
    );
  }
  if (!lastName || lastName.length < 2 || lastName.length > 30) {
    throw new Error(
      "Last name is required and must be between 2 and 30 characters."
    );
  }
  if (!phoneNumber || !validator.isMobilePhone(phoneNumber + "", "any")) {
    throw new Error("A valid phone number is required.");
  }
}

export function validateUpdateCustomerData(data) {
  const allowedFields = ["firstName", "lastName", "phoneNumber"];
  for (const field of Object.keys(data)) {
    if (!allowedFields.includes(field)) {
      throw new Error(`Invalid field: ${field}`);
    }
    if (
      (field === "firstName" || field === "lastName") &&
      (data[field].length < 2 || data[field].length > 30)
    ) {
      throw new Error(
        `${field} must be between 2 and 30 characters if provided.`
      );
    }
    if (
      field === "phoneNumber" &&
      !validator.isMobilePhone(data[field] + "", "any")
    ) {
      throw new Error("A valid phone number is required if provided.");
    }
  }
}
