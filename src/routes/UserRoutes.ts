import { Router } from 'express';
import UserController from '../controllers/UserController';
import { authenticateToken } from '../middlewares/AuthMiddleware';

const router = Router();

router.post('/login', UserController.login);
router.get('/', authenticateToken, UserController.getDataById);
// router.get('/public/all', UserController.getPublicData);
router.get('/public/:id', UserController.getPublicDataById);
router.put('/edit', authenticateToken, UserController.edit);
// router.delete('/delete/:id', authenticateToken, UserController.delete);
router.delete('/delete/:id', UserController.delete); // apenas pra testes

export default router;
