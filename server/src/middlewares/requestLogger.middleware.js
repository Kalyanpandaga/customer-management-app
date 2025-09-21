import logger from "../utils/logger.js";

export default function requestLoggerMiddleware(req, res, next) {
  const startTime = Date.now();

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function (chunk, encoding) {
    const responseTime = Date.now() - startTime;
    logger.logRequest(req, res, responseTime);
    originalEnd.call(this, chunk, encoding);
  };

  next();
}
