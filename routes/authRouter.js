import express from "express";
import authController from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.get('/', authController.getAll);
authRouter.get('/login', authController.getLogin);
authRouter.get('/signup', authController.getSignup);
authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login)
 
export default authRouter;  