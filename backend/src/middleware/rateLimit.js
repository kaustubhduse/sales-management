import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * 100 requests per minute
 */
export const apiLimiter = rateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 100, // 100 requests per window
  message: { 
    success: false,
    message: 'Too many requests from this IP, please try again later.' 
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

/**
 * Search/Filter rate limiter
 * More strict for expensive operations
 */
export const searchLimiter = rateLimit({
  windowMs: 1*60*1000,
  max: 30, // 30 searches per minute
  message: { 
    success: false,
    message: 'Too many search requests, please slow down.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict limiter for very expensive operations
 * (exports, bulk operations, etc.)
 */
export const strictLimiter = rateLimit({
  windowMs: 1*60*1000,
  max: 10, // Only 10 requests per minute
  message: { 
    success: false,
    message: 'Rate limit exceeded for this operation.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});
