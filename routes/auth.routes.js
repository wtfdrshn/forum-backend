import express from 'express';
import authController from '../controllers/auth.controller.js';
import validator from '../validators/auth.validator.js'
import validate from '../middlewares/validate-middleware.js';
import authMiddleware from '../middlewares/auth-middleware.js';
const authRouter = express.Router();

authRouter.route('/').get(authController.home);
authRouter.route('/register').post(validate(validator.registerSchema), authController.register);
authRouter.route('/login').post(validate(validator.loginSchema), authController.login);  
authRouter.route('/user').get(authMiddleware, authController.user);

export default authRouter;