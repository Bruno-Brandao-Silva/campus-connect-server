import multer from 'multer';

const storage = multer.memoryStorage();
const uploadMulter = multer({ storage: storage });
const upload = uploadMulter.single('file')
export { upload };
