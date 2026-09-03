import rateLimit from'express-rate-limit';

export const globalRateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  max: Number(process.env.RATE_LIMIT_MAX || 100),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code:'TOO_MANY_REQUESTS',
      message:'Too many requests from this IP, please try again later.',
    },
  },
});

export const commentRateLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 10, // Max 10 comments per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code:'TOO_MANY_REQUESTS',
      message:'Comment rate limit exceeded. Please wait a minute before posting again.',
    },
  },
});
