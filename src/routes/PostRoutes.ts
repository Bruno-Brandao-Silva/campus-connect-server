import express from 'express';
import PostController from '../controllers/PostController';
import {authenticateToken} from '../middlewares/AuthMiddleware';

const router = express.Router();

router.post('/', authenticateToken, PostController.createPost);
router.get('/', PostController.getPosts);

export default router;
