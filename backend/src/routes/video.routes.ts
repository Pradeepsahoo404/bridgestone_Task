import { Router } from'express';
import { getVideos, getVideoById } from'../controllers/video.controller.js';
import { validateQuery } from'../middleware/validate.js';
import { GetVideosQuerySchema } from'../schemas/index.js';

const router = Router();

router.get('/', validateQuery(GetVideosQuerySchema), getVideos);
router.get('/:id', getVideoById);

export default router;
