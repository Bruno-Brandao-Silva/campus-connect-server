import { Router } from 'express';
import MessageController from '../controllers/MessageController';

const router = Router();

router.post('/', MessageController.sendMessage);

export default router;
