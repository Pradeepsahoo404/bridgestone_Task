import { Router } from'express';
import { likeVideo } from'../controllers/like.controller.js';
import { shareVideo } from'../controllers/share.controller.js';
import { validateBody } from'../middleware/validate.js';
import { LikeVideoSchema, ShareVideoSchema } from'../schemas/index.js';

const router = Router();

router.post('/like', validateBody(LikeVideoSchema), likeVideo);
router.post('/share', validateBody(ShareVideoSchema), shareVideo);

export default router;
