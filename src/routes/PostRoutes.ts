import { Router } from 'express';
import PostController from '../controllers/PostController';
import {authenticateToken} from '../middlewares/AuthMiddleware';

const router = Router();

router.post('/', authenticateToken, PostController.createPost);
router.get('/', PostController.getPosts);

export default router;
