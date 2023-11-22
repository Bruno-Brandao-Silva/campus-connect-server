import { Router } from 'express';
import TimelineController from '../controllers/TimelineController';
import { VerifyAuth } from '../middlewares/AuthMiddleware';

const router = Router();


router.get('/', VerifyAuth, TimelineController.getTimeline);

export default router;