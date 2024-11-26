import express from "express";
import authController from '../controllers/authController.js';
// import userController from '../controllers/userController.js';
// import storeController from '../controllers/storeController.js';
// import adminController from '../controllers/adminController.js';
import productController from '../controllers/productController.js';

const router = express.Router();
// //user
// router.get('/', userController.getAll);
// router.get('/product/:id', userController.getProduct);
// router.get('/profile/:id', userController.getProfile);
// router.get('/search/:query?', userController.search); // 'search/abc?MaxPrice=10000&minPrice=20000&rateFiler=4&page=1'

//auth
router.get('/auth', authController.getAuthentication);
// router.get('/forget_password', authController.getForgetPassword);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
// router.post('/forget_password', authController.resetPassword);
// router.post('/change_password', authController.changePassword);

//store


//admin


// product
router.get('/product/:id', productController.getDetailProduct);
 
export default router;  