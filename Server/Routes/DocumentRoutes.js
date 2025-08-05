import express from 'express';
import multer from 'multer';
import { processDocument } from '../Controllers/documentController.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/process', upload.single('file'), processDocument);

// Use 'export default' instead of 'module.exports'
export default router;