import express from "express";
import teamController from "../controllers/team.controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import adminMiddleware from "../middlewares/admin-middleware.js";
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

const upload = multer({ storage });

TeamRoutes.get("/all", teamController.getMembers);
TeamRoutes.post("/add", authMiddleware, adminMiddleware, upload.single('photo'), teamController.addMember);
TeamRoutes.put("/update/:id", authMiddleware, adminMiddleware, upload.single('photo'), teamController.updateMember);
TeamRoutes.delete("/delete/:id", authMiddleware, adminMiddleware, teamController.deleteMember);

export default TeamRoutes;
