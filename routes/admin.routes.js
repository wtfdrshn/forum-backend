import express from 'express';
import adminController from '../controllers/admin.controller.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import adminMiddleware from '../middlewares/admin-middleware.js';

const adminRouter = express.Router();

// All routes require authentication and admin privileges
adminRouter.use(authMiddleware);
adminRouter.use(adminMiddleware);

// Get all admins
adminRouter.route('/').get(adminController.getAllAdmins);

// Get available pages for permissions
adminRouter.route('/pages').get(adminController.getAvailablePages);

// Create a new admin
adminRouter.route('/create').post(adminController.createAdmin);

// Update admin permissions
adminRouter.route('/:adminId/permissions').put(adminController.updateAdminPermissions);

// Update admin password (super admin only)
adminRouter.route('/:adminId/password').put(adminController.updateAdminPassword);

// Change own password (any admin)
adminRouter.route('/change-password').put(adminController.changeOwnPassword);

// Delete admin
adminRouter.route('/:adminId').delete(adminController.deleteAdmin);

export default adminRouter;

