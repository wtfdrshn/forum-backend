import express from 'express';
import multer from 'multer';
import blogController from '../controllers/blog.controller.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import adminMiddleware from '../middlewares/admin-middleware.js';
import dbCheckMiddleware from '../middlewares/db-check-middleware.js';

const BlogRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });


BlogRouter.route('/create').post(authMiddleware, adminMiddleware, upload.single('image'), blogController.createBlog)
BlogRouter.route('/edit/:id').put(authMiddleware, adminMiddleware, upload.single('image'), blogController.updateBlog)
BlogRouter.route('/delete/:id').delete(authMiddleware, adminMiddleware, blogController.deleteBlog) 
BlogRouter.route('/all').get(dbCheckMiddleware, blogController.getAllBlogs)
BlogRouter.route('/:slug').get(dbCheckMiddleware, blogController.getBlogBySlug)
// BlogRouter.route('/get/:id').get(blogController.getBlogById)

export default BlogRouter;