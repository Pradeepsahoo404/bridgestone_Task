import { Request, Response, NextFunction } from'express';
import { interactionService } from'../services/interaction.service.js';
import { ShareVideoInput } from'../schemas/index.js';

export async function shareVideo(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as ShareVideoInput;
    const result = await interactionService.handleShare(input);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
