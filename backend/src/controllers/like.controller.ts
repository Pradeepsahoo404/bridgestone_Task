import { Request, Response, NextFunction } from'express';
import { interactionService } from'../services/interaction.service.js';
import { LikeVideoInput } from'../schemas/index.js';

export async function likeVideo(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as LikeVideoInput;
    const clientIp = req.ip || req.socket.remoteAddress ||'127.0.0.1';
    const result = await interactionService.handleLike(input, clientIp);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
