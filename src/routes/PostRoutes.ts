import { Router } from 'express';
import PostController from '../controllers/PostController';
import { VerifyAuth } from '../middlewares/AuthMiddleware';

const router = Router();

router.post('/', VerifyAuth, PostController.createPost);
router.get('/', VerifyAuth, PostController.getMyPosts);
router.get('/:userId', VerifyAuth, PostController.getPostsFromUserId);
router.patch('/:postId/like', VerifyAuth, PostController.likePost);
router.patch('/:postId/unlike', VerifyAuth, PostController.unlikePost);
router.delete('/:postId', VerifyAuth, PostController.deletePost);
router.patch('/:postId/comment', VerifyAuth, PostController.commentOnPost);


export default router;
