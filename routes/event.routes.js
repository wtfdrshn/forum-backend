import express from 'express';
import EventController from '../controllers/event.controller.js';
import multer from 'multer';
import authMiddleware from '../middlewares/auth-middleware.js';
import adminMiddleware from '../middlewares/admin-middleware.js';

const EventRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Routes
EventRouter.get('/all', EventController.getAllEvents);
EventRouter.post('/create', authMiddleware, adminMiddleware, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'images', maxCount: 5 }]), EventController.createEvent);
EventRouter.get('/:id', EventController.getEventById);
EventRouter.put('/update/:id', authMiddleware, adminMiddleware, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'images', maxCount: 5 }]), EventController.updateEvent);
EventRouter.delete('/delete/:id', authMiddleware, adminMiddleware, EventController.deleteEvent);

export default EventRouter;


