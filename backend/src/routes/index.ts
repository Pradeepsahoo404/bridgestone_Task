import { Router } from'express';
import videoRoutes from'./video.routes.js';
import interactionRoutes from'./interaction.routes.js';
import commentRoutes from'./comment.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status:'ok',
    },
  });
});

router.use('/videos', videoRoutes);
router.use('/', interactionRoutes);
router.use('/videos/:videoId/comments', commentRoutes);

export default router;
