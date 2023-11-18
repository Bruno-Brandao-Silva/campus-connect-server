import { Router } from "express";
import { upload } from "../middlewares/Multer"
import { VerifyAuth } from "../middlewares/AuthMiddleware";
import FileController from "../controllers/FileController";

const router = Router();

router.post('/', VerifyAuth, upload, FileController.handleUpload);
router.get('/:id', VerifyAuth, FileController.downloadById);
router.delete('/:id', VerifyAuth, FileController.deleteById);

export default router;