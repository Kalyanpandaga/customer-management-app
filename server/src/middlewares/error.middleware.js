import logger from "../utils/logger.js";

export default function errorMiddleware(err, req, res, next) {
  // Log the error
  logger.logError(err, req);

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Determine error code
  let errorCode = err.errorCode || "INTERNAL_ERROR";

  // Handle specific error types
  if (err.name === "ValidationError") {
    errorCode = "VALIDATION_ERROR";
  } else if (err.name === "CastError") {
    errorCode = "INVALID_ID";
  } else if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
    errorCode = "DUPLICATE_ENTRY";
  } else if (err.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
    errorCode = "FOREIGN_KEY_CONSTRAINT";
  }

  // Prepare error response
  const errorResponse = {
    statusCode,
    errorCode,
    errorMessage: err.message || "An unexpected error occurred",
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    errorResponse.errorMessage = "Internal server error";
  }

  res.status(statusCode).json(errorResponse);
}
