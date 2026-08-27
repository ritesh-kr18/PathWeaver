const rateLimit = require('express-rate-limit');

// Rate limiter for AI endpoints (20 requests per minute)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many AI requests, please try again later' }
});

// Rate limiter for auth endpoints (10 requests per minute)
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts, please try again later' }
});

module.exports = { aiLimiter, authLimiter };
