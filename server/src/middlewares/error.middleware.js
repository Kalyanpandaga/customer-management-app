export default function errorMiddleware(err, req, res, next) {
  console.error(err);
  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    errorCode: err.errorCode || "INTERNAL_ERROR",
    errorMessage: err.message || "Unexpected error occurred.",
  });
}
