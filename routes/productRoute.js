import express from "express";
import productController from "../controllers/productController.js";

const productRouter = express.Router();

// productRouter.get('/add', productController.getAddProduct);
// productRouter.post('/add', productController.addProduct);
// productRouter.get('/update', productController.getUpdateProduct);
// productRouter.put('/update', productController.updateProduct);
productRouter.get('/detail/:productID', productController.detailProduct);

export default productRouter;