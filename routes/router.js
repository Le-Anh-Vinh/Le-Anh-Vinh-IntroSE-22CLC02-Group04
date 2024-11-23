import express from "express";
import authController from '../controllers/authController.js';
import mainController from '../controllers/mainController.js';
import storeController from '../controllers/storeController.js';
import adminController from '../controllers/adminController.js';

const router = express.Router();
//main
router.get('/', mainController.getAll);
//auth
router.get('/auth', authController.getAuthentication);
router.get('/forget_password', authController.getForgetPassword);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forget_password', authController.resetPassword);
router.post('/change_password', authController.changePassword);
//store

//admin
 
export default router;  