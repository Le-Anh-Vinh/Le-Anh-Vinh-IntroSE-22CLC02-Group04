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
router.post('/signup', authController.signup);
router.post('/login', authController.login)
router.post('/changepass', authController.changePassword)
//store

//admin
 
export default router;  