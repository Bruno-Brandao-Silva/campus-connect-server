import { Router } from 'express';
import PostController from '../controllers/PostController';
import { authenticateToken } from '../middlewares/AuthMiddleware';

const router = Router();

router.post('/', authenticateToken, PostController.createPost);
router.get('/', authenticateToken, PostController.getMyPosts);
router.get('/:userId', authenticateToken, PostController.getPostsFromUserId);
router.patch('/:postId/like', authenticateToken, PostController.likePost);
router.patch('/:postId/unlike', authenticateToken, PostController.unlikePost);
router.delete('/:postId', authenticateToken, PostController.deletePost);
router.patch('/:postId/comment', authenticateToken, PostController.commentOnPost);


export default router;
