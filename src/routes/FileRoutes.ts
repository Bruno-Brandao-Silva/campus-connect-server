import { Router } from "express";
import { upload } from "../middlewares/Multer"
import FileController from "../controllers/FileController";

const router = Router();
router.post('/', upload, FileController.handleUpload);
router.get('/filename/:filename', FileController.downloadByName);
router.get('/:id', FileController.downloadByName);
export default router;