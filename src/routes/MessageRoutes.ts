import express from 'express';
import MessageController from '../controllers/MessageController';

const router = express.Router();

router.post('/', MessageController.sendMessage);

export default router;
