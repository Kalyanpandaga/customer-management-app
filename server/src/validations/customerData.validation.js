import validator from "validator";

// Enhanced validation with comprehensive checks
export function validateCreateCustomerData(data) {
  const errors = [];
  const { firstName, lastName, phoneNumber } = data;

  // First Name validation
  if (!firstName) {
    errors.push("First name is required");
  } else if (typeof firstName !== "string") {
    errors.push("First name must be a string");
  } else if (firstName.trim().length < 2) {
    errors.push("First name must be at least 2 characters long");
  } else if (firstName.trim().length > 50) {
    errors.push("First name must not exceed 50 characters");
  } else if (!/^[a-zA-Z\s'-]+$/.test(firstName.trim())) {
    errors.push(
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    );
  }

  // Last Name validation
  if (!lastName) {
    errors.push("Last name is required");
  } else if (typeof lastName !== "string") {
    errors.push("Last name must be a string");
  } else if (lastName.trim().length < 2) {
    errors.push("Last name must be at least 2 characters long");
  } else if (lastName.trim().length > 50) {
    errors.push("Last name must not exceed 50 characters");
  } else if (!/^[a-zA-Z\s'-]+$/.test(lastName.trim())) {
    errors.push(
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    );
  }

  // Phone Number validation
  if (!phoneNumber) {
    errors.push("Phone number is required");
  } else if (typeof phoneNumber !== "string") {
    errors.push("Phone number must be a string");
  } else {
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, "");
    if (!validator.isMobilePhone(cleanPhone, "any")) {
      errors.push("Please enter a valid phone number");
    } else if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      errors.push("Phone number must be between 10 and 15 digits");
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }

  // Sanitize data
  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    phoneNumber: phoneNumber.replace(/[\s\-\(\)]/g, ""),
  };
}

export function validateUpdateCustomerData(data) {
  const errors = [];
  const allowedFields = ["firstName", "lastName", "phoneNumber"];
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

    if (field === "firstName" || field === "lastName") {
      if (typeof value !== "string") {
        errors.push(`${field} must be a string`);
      } else if (value.trim().length < 2) {
        errors.push(`${field} must be at least 2 characters long`);
      } else if (value.trim().length > 50) {
        errors.push(`${field} must not exceed 50 characters`);
      } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
        errors.push(
          `${field} can only contain letters, spaces, hyphens, and apostrophes`
        );
      } else {
        sanitizedData[field] = value.trim();
      }
    } else if (field === "phoneNumber") {
      if (typeof value !== "string") {
        errors.push("Phone number must be a string");
      } else {
        const cleanPhone = value.replace(/[\s\-\(\)]/g, "");
        if (!validator.isMobilePhone(cleanPhone, "any")) {
          errors.push("Please enter a valid phone number");
        } else if (cleanPhone.length < 10 || cleanPhone.length > 15) {
          errors.push("Phone number must be between 10 and 15 digits");
        } else {
          sanitizedData[field] = cleanPhone;
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }

  return sanitizedData;
}

// New validation for search parameters
export function validateSearchParams(params) {
  const errors = [];
  const { city, state, pinCode, page, limit, sort, search } = params;

  if (city && (typeof city !== "string" || city.trim().length > 100)) {
    errors.push("City must be a string with maximum 100 characters");
  }

  if (state && (typeof state !== "string" || state.trim().length > 100)) {
    errors.push("State must be a string with maximum 100 characters");
  }

  if (
    pinCode &&
    (typeof pinCode !== "string" || !/^\d{4,10}$/.test(pinCode.trim()))
  ) {
    errors.push("PIN code must be 4-10 digits");
  }

  if (search && (typeof search !== "string" || search.trim().length > 100)) {
    errors.push("Search term must be a string with maximum 100 characters");
  }

  if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
    errors.push("Page must be a positive integer");
  }

  if (
    limit &&
    (!Number.isInteger(Number(limit)) ||
      Number(limit) < 1 ||
      Number(limit) > 100)
  ) {
    errors.push("Limit must be between 1 and 100");
  }

  if (sort && !["asc", "desc", "ASC", "DESC"].includes(sort)) {
    errors.push("Sort must be 'asc' or 'desc'");
  }

  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }

  return {
    city: city?.trim(),
    state: state?.trim(),
    pinCode: pinCode?.trim(),
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    sort: sort?.toLowerCase() || "asc",
    search: search?.trim(),
  };
}
