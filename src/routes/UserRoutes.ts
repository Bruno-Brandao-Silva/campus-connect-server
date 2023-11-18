import { Router } from 'express';
import UserController from '../controllers/UserController';
import { VerifyAuth } from '../middlewares/AuthMiddleware';

const router = Router();

router.get('/', VerifyAuth, UserController.get);
router.get('/:id', VerifyAuth, UserController.getById);
router.patch('/', VerifyAuth, UserController.patch);
router.delete('/', VerifyAuth, UserController.delete);
router.get('/search/:query', VerifyAuth, UserController.search);
router.patch('/follow/:id', VerifyAuth, UserController.follow);
router.patch('/unfollow/:id', VerifyAuth, UserController.unfollow);
router.delete('/delete/', VerifyAuth, UserController.delete);
router.delete('/delete/:id', UserController.deleteTestes); // apenas pra testes

export default router;
