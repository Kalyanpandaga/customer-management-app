import validator from "validator";

// Enhanced address validation with comprehensive checks
export function validateCreateAddressData(data) {
  const errors = [];
  const { customerId, addressDetails, city, state, pinCode } = data;

  // Customer ID validation
  if (!customerId) {
    errors.push("Customer ID is required");
  } else if (!Number.isInteger(Number(customerId)) || Number(customerId) <= 0) {
    errors.push("Customer ID must be a positive integer");
  }

  // Address Details validation
  if (!addressDetails) {
    errors.push("Address details are required");
  } else if (typeof addressDetails !== "string") {
    errors.push("Address details must be a string");
  } else if (addressDetails.trim().length < 10) {
    errors.push("Address details must be at least 10 characters long");
  } else if (addressDetails.trim().length > 500) {
    errors.push("Address details must not exceed 500 characters");
  } else if (!/^[a-zA-Z0-9\s\-\.,#\/]+$/.test(addressDetails.trim())) {
    errors.push("Address details contain invalid characters");
  }

  // City validation
  if (!city) {
    errors.push("City is required");
  } else if (typeof city !== "string") {
    errors.push("City must be a string");
  } else if (city.trim().length < 2) {
    errors.push("City must be at least 2 characters long");
  } else if (city.trim().length > 100) {
    errors.push("City must not exceed 100 characters");
  } else if (!/^[a-zA-Z\s\-']+$/.test(city.trim())) {
    errors.push(
      "City can only contain letters, spaces, hyphens, and apostrophes"
    );
  }

  // State validation
  if (!state) {
    errors.push("State is required");
  } else if (typeof state !== "string") {
    errors.push("State must be a string");
  } else if (state.trim().length < 2) {
    errors.push("State must be at least 2 characters long");
  } else if (state.trim().length > 100) {
    errors.push("State must not exceed 100 characters");
  } else if (!/^[a-zA-Z\s\-']+$/.test(state.trim())) {
    errors.push(
      "State can only contain letters, spaces, hyphens, and apostrophes"
    );
  }

  // PIN Code validation
  if (!pinCode) {
    errors.push("PIN code is required");
  } else if (typeof pinCode !== "string") {
    errors.push("PIN code must be a string");
  } else {
    const cleanPinCode = pinCode.replace(/\s/g, "");
    if (!/^\d{4,10}$/.test(cleanPinCode)) {
      errors.push("PIN code must be 4-10 digits");
    } else if (!validator.isPostalCode(cleanPinCode, "any")) {
      errors.push("Please enter a valid PIN code");
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }

  // Sanitize data
  return {
    customerId: Number(customerId),
    addressDetails: addressDetails.trim(),
    city: city.trim(),
    state: state.trim(),
    pinCode: pinCode.replace(/\s/g, ""),
  };
}

export function validateUpdateAddressData(data) {
  const errors = [];
  const allowedFields = ["addressDetails", "city", "state", "pinCode"];
  const sanitizedData = {};

  for (const field of Object.keys(data)) {
    if (!allowedFields.includes(field)) {
      errors.push(`Invalid field: ${field}`);
      continue;
    }

    const value = data[field];
    if (value === undefined || value === null) {
      continue; // Skip undefined/null values
    }

    if (field === "addressDetails") {
      if (typeof value !== "string") {
        errors.push("Address details must be a string");
      } else if (value.trim().length < 10) {
        errors.push("Address details must be at least 10 characters long");
      } else if (value.trim().length > 500) {
        errors.push("Address details must not exceed 500 characters");
      } else if (!/^[a-zA-Z0-9\s\-\.,#\/]+$/.test(value.trim())) {
        errors.push("Address details contain invalid characters");
      } else {
        sanitizedData[field] = value.trim();
      }
    } else if (field === "city" || field === "state") {
      if (typeof value !== "string") {
        errors.push(`${field} must be a string`);
      } else if (value.trim().length < 2) {
        errors.push(`${field} must be at least 2 characters long`);
      } else if (value.trim().length > 100) {
        errors.push(`${field} must not exceed 100 characters`);
      } else if (!/^[a-zA-Z\s\-']+$/.test(value.trim())) {
        errors.push(
          `${field} can only contain letters, spaces, hyphens, and apostrophes`
        );
      } else {
        sanitizedData[field] = value.trim();
      }
    } else if (field === "pinCode") {
      if (typeof value !== "string") {
        errors.push("PIN code must be a string");
      } else {
        const cleanPinCode = value.replace(/\s/g, "");
        if (!/^\d{4,10}$/.test(cleanPinCode)) {
          errors.push("PIN code must be 4-10 digits");
        } else if (!validator.isPostalCode(cleanPinCode, "any")) {
          errors.push("Please enter a valid PIN code");
        } else {
          sanitizedData[field] = cleanPinCode;
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }

  return sanitizedData;
}
