import { Request, Response, NextFunction } from'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown[];
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const code = err.code || (statusCode === 404 ?'NOT_FOUND' :'INTERNAL_SERVER_ERROR');
  const message = err.message ||'An unexpected server error occurred';

  if (process.env.NODE_ENV !=='test' && statusCode >= 500) {
    console.error('[ServerError]', err);
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(err.details ? { details: err.details } : {}),
    },
  });
}
