import { Router } from'express';
import { getComments, createComment } from'../controllers/comment.controller.js';
import { validateBody } from'../middleware/validate.js';
import { CreateCommentSchema } from'../schemas/index.js';
import { commentRateLimiter } from'../middleware/rate-limiter.js';

const router = Router({ mergeParams: true });

router.get('/', getComments);
router.post('/', commentRateLimiter, validateBody(CreateCommentSchema), createComment);

export default router;
