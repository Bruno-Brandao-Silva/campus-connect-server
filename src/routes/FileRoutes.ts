import { Router } from "express";
import { upload } from "../middlewares/Multer"
import FileController from "../controllers/FileController";

const router = Router();

router.post('/', upload, FileController.handleUpload);
router.get('/:id', FileController.downloadById);

export default router;