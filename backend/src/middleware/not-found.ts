import { Request, Response } from'express';

export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json({
    success: false,
    error: {
      code:'NOT_FOUND',
      message:'The requested resource or endpoint was not found',
    },
  });
}
