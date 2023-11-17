import { Router } from "express";
import FileController from "../controllers/FileController";

const router = Router();
router.post('/upload', FileController.upload, FileController.handleUpload);
export default router;