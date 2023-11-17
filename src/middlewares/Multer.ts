import multer from 'multer';

const storage = multer.memoryStorage();
const uploadMulter = multer({ storage: storage });
const upload = uploadMulter.array('files')
export { upload };
