import { Request, Response, NextFunction } from'express';
import { videoService } from'../services/video.service.js';
import { GetVideosQuery } from'../schemas/index.js';

export async function getVideos(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as GetVideosQuery;
    const result = await videoService.getVideos(query);
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getVideoById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const video = await videoService.getVideoById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        error: {
          code:'NOT_FOUND',
          message: `Video with ID'${id}' was not found`,
        },
      });
    }

    return res.json({
      success: true,
      data: video,
    });
  } catch (error) {
    next(error);
  }
}
