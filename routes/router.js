import express from "express";
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import storeController from '../controllers/storeController.js';
import adminController from '../controllers/adminController.js';
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
router.get('/profile/:id', userController.getProfile);
router.get('/search/:query?', userController.search); // '/search/ph?maxPrice=160000&minPrice=10000&rateFilter=2&page=1'
router.post('/user/edit', userController.changeUserInfo);
router.post('/store/edit', userController.changeStoreInfo);
router.get('/store/:id', userController.getStore);
router.get('/payment/:id', userController.getPayment);
router.get('/reportStore/:id', userController.getReport);
router.post('/reportStore', userController.reportStore);

//cart
router.get('/cart/:id', cartController.getCart);
router.get('/historyOrder/:id', cartController.viewHistoryOrder);
router.put('/cart/:id', cartController.updateItem);
router.post('/cart/:id', cartController.addToCart);
router.delete('/cart/:id', cartController.removeItem);
router.post('/payment/:id', cartController.checkOut);

//store
router.get('/:id/order', storeController.viewOrder);
router.get('/order/:orderID', storeController.viewOrderDetail);
router.put('/order/status', storeController.confirmOrder);
router.delete('/product/:id', storeController.removeProduct);

//product
router.get('/product/:id', productController.getDetailProduct);
router.get('/:id/add', productController.getAddProduct);
router.get('/:id/update', productController.getUpdateProduct);
router.put('/product/update', productController.updateProduct);
router.post('/:id/add', productController.addProduct);
router.get('/product/review/:id', productController.getReview);
router.post('/product/review', productController.addRating);

//admin
router.get('/report/:id', adminController.getReport);
router.put('/report', adminController.reviewReport);
 
export default router;  