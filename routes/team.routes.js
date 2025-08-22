import express from "express";
import teamController from "../controllers/team.controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import adminMiddleware from "../middlewares/admin-middleware.js";
import dbCheckMiddleware from "../middlewares/db-check-middleware.js";
import multer from "multer";
const TeamRoutes = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB in bytes
    }
});

const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB'
            });
        }
    }
    next(err);
};

TeamRoutes.get("/all", dbCheckMiddleware, teamController.getMembers);
TeamRoutes.post("/add", authMiddleware, adminMiddleware, upload.single('photo'), handleMulterError, teamController.addMember);
TeamRoutes.put("/update/:id", authMiddleware, adminMiddleware, upload.single('photo'), handleMulterError, teamController.updateMember);
TeamRoutes.delete("/delete/:id", authMiddleware, adminMiddleware, teamController.deleteMember);

export default TeamRoutes;
