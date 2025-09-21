// Simple in-memory rate limiter
const requests = new Map();

export default function rateLimiterMiddleware(req, res, next) {
  const clientId = req.ip || "unknown";
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Max 100 requests per window

  if (!requests.has(clientId)) {
    requests.set(clientId, { count: 1, resetTime: now + windowMs });
    return next();
  }

  const clientData = requests.get(clientId);

  if (now > clientData.resetTime) {
    // Reset window
    requests.set(clientId, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (clientData.count >= maxRequests) {
    return res.status(429).json({
      statusCode: 429,
      errorCode: "RATE_LIMIT_EXCEEDED",
      errorMessage: "Too many requests, please try again later",
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
    });
  }

  clientData.count++;
  next();
}
