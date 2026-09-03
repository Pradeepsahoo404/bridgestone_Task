import { Request, Response, NextFunction } from'express';
import { commentService } from'../services/comment.service.js';
import { CreateCommentInput } from'../schemas/index.js';

export async function getComments(req: Request, res: Response, next: NextFunction) {
  try {
    const { videoId } = req.params;
    const comments = await commentService.getComments(videoId);

    return res.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
}

export async function createComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { videoId } = req.params;
    const input = req.body as CreateCommentInput;
    const comment = await commentService.createComment(videoId, input);

    return res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
}
