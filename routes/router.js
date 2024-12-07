import express from "express";
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
// import storeController from '../controllers/storeController.js';
// import adminController from '../controllers/adminController.js';
import cartController from "../controllers/cartController.js";
import productController from '../controllers/productController.js';

const router = express.Router();
//auth
router.get('/auth', authController.getAuthentication);
router.get('/forget_password', authController.getForgetPassword);
router.get('/complete_signup', authController.getInputInfo);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forget_password', authController.resetPassword);
router.post('/change_password', authController.changePassword);

//user
router.get('/:id', userController.getAll); // '/catID=1&page=1'
router.get('/product/:id', productController.getDetailProduct);
router.get('/profile/:id', userController.getProfile);
router.get('/search/:query?', userController.search); // '/search/ph?maxPrice=160000&minPrice=10000&rateFilter=2&page=1'
router.post('/user/edit', userController.changeUserInfo);
router.get('/store/:id', userController.getStore);

//cart
router.get('/cart/:id', cartController.getCart);
router.get('/orders/:id', cartController.viewHistoryOrder);
router.put('/cart/:id', cartController.updateItem);
router.post('/cart/:id', cartController.addToCart);
router.delete('/cart/:id', cartController.removeItem);

//store
router.get('/:id/add', productController.getAddProduct);
router.get('/:id/update', productController.getUpdateProduct);
router.put('/product/update', productController.updateProduct);
router.post('/:id/add', productController.addProduct);

//admin

 
export default router;  