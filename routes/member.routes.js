import express from 'express';
import memberController from '../controllers/member.controller.js';
import validate from '../middlewares/validate-middleware.js';
import memberValidator from '../validators/member.validator.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import adminMiddleware from '../middlewares/admin-middleware.js';
import dbCheckMiddleware from '../middlewares/db-check-middleware.js';
import Member from '../models/member.model.js';

const memberRouter = express.Router();

memberRouter.route('/all').get(authMiddleware, adminMiddleware, memberController.getAllMembers);
memberRouter.route('/join').post(validate(memberValidator.memberRegistrationSchema), memberController.memberRegistration);
memberRouter.route('/badge/:id').get(dbCheckMiddleware, memberController.getMemberBadge);
memberRouter.route('/badge/verify/:id').get(dbCheckMiddleware, memberController.verifyMemberBadge);
memberRouter.route('/stats').get(dbCheckMiddleware, memberController.getMemberStats);

export default memberRouter;