import express from 'express';
import galleryController from '../controllers/gallery.controller.js';
import multer from 'multer';
import adminMiddleware from '../middlewares/admin-middleware.js';
import authMiddleware from '../middlewares/auth-middleware.js';

const galleryRouter = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

galleryRouter.route('/all').get(galleryController.getImages);
galleryRouter.route('/upload').post(authMiddleware, adminMiddleware, upload.single('image'), galleryController.uploadImage);
galleryRouter.route('/delete/:id').delete(authMiddleware, adminMiddleware, galleryController.deleteImage);

export default galleryRouter;