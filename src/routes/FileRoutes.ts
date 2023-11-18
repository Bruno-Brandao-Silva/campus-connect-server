import { Router } from "express";
import { upload } from "../middlewares/Multer"
import { authenticateToken } from "../middlewares/AuthMiddleware";
import FileController from "../controllers/FileController";

const router = Router();

router.post('/', authenticateToken, upload, FileController.handleUpload);
router.get('/:id', authenticateToken, FileController.downloadById);
router.delete('/:id', authenticateToken, FileController.deleteById);

export default router;