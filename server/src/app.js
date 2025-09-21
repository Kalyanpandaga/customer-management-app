import express from "express";
import cors from "cors";
import helmet from "helmet";
import { ALLOWED_ORIGIN } from "./config/constants.js";
import customersRouter from "./routes/customers.route.js";
import addressesRouter from "./routes/addresses.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import requestLoggerMiddleware from "./middlewares/requestLogger.middleware.js";
import rateLimiterMiddleware from "./middlewares/rateLimiter.middleware.js";
import logger from "./utils/logger.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
app.use(rateLimiterMiddleware);

// Request logging
app.use(requestLoggerMiddleware);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use("/api/customers", customersRouter);
app.use("/api/addresses", addressesRouter);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    statusCode: 404,
    errorCode: "NOT_FOUND",
    errorMessage: "The requested resource was not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Graceful shutdown handling
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

export default app;
