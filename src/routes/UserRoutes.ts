import { Router } from 'express';
import UserController from '../controllers/UserController';
import { authenticateToken } from '../middlewares/AuthMiddleware';

const router = Router();

router.get('/', authenticateToken, UserController.get);
router.get('/:id', authenticateToken, UserController.getById);
router.patch('/', authenticateToken, UserController.patch);
router.delete('/', authenticateToken, UserController.delete);
router.get('/search/:query', authenticateToken, UserController.search);
router.patch('/follow/:id', authenticateToken, UserController.follow);
router.patch('/unfollow/:id', authenticateToken, UserController.unfollow);
router.delete('/delete/', authenticateToken, UserController.delete);
router.delete('/delete/:id', UserController.deleteTestes); // apenas pra testes

export default router;
