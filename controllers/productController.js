import db from '../config/db.js';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import MyError from '../cerror.js';
import productData from '../models/products.js';
import user from '../models/users.js';
import categoryData from '../models/category.js';

const productController = {
    getDetailProduct: async (req, res, next) => {
        try {
            const procID = req.params.id;
            // handle product information
            const productDoc = await productData.get(procID);
            // handle store information
            const storeDoc = await user.get(productDoc.store_id);
            if (!storeDoc) {
                new MyError(404, "Store not found");
            }

            // handle relative products
            const categoryValues = Object.values(productDoc.category);
            const relativeProducts = new Set();

            for (let category of categoryValues) {
                const relativeCollection = collection(db, 'product');
                const rq = query(
                    relativeCollection,
                    where('category', 'array-contains', category)
                );
                const relativeSnapshot = await getDocs(rq);
                relativeSnapshot.forEach((doc) => {
                    const product = doc.data();
                    // ensure that the product ID is not the same as the current product
                    if (product.product_id !== procID) {
                        relativeProducts.add(product);
                    }
                });
            }
            const relativeProductList = Array.from(relativeProducts);
            res.render('productDetail', {
                product: productDoc,                // product information
                store: storeDoc,                    // store information
                relativeProducts: relativeProductList  // relative products
            });
        } catch (error) {
            next(new MyError(error.status, error.message));
        }
    },

    addRating: async (req, res, next) => { 
        try {
            const {product_id, review} = req.body;
            await productData.update(product_id, {review: [review]});
            res.json({status: true});
        } catch (error) {
            console.error(error.message);
            res.status(500).json({error: error.message});
        }
    },

    getAddProduct: async (req, res, next) => {
        try {
            const storeID = req.params.id;
            const categories = await categoryData.getAll();
            res.render('addProduct', { storeID, categories: categories });
        } catch (error) {
            next(new MyError(error.status, error.message));
        }
    },

    addProduct: async (req, res, next) => {
        try {
            const product = req.body;
            product.varians = product.varians.split('\n').map(item => item.trim());
            product.images = product.images.split(',').map(item => item.trim());
            product.rate = 0;
            product.reviews = [];
            product.status = true;
            product.price = parseFloat(product.price);

            if (product.price < 0) {
                res.json({ status: true, message: "Invalid price" });
                return;
            }
            await productData.new(product);
            res.json({status: true, message: "Product added successfully"});
        } catch (error) {
            console.error(error.message);
            res.status(500).json({error: error.message});
        }
    },

    getUpdateProduct: async (req, res, next) => {
        try {
            const productID = req.params.id;
            const product = await productData.get(productID);
            const categories = await categoryData.getAll();
            res.render('updateProduct', { product, categories: categories });
        } catch (error) {
            next(new MyError(error.status, error.message));
        }
    },

    updateProduct: async (req, res, next) => {
        try {
            const product = req.body;
            product.varians = product.varians.split(',').map(item => item.trim());
            product.images = product.images.split(',').map(item => item.trim());
            product.price = parseFloat(product.price);

            if (product.price < 0) {
                res.json({ status: true, message: "Invalid price" });
                return;
            }
            console.log(product.product_id);
            console.log(product);
            await productData.update(product.product_id, product);
            res.json({status: true, message: "Product updated successfully"});
        } catch (error) {
            console.error(error.message);
            res.status(500).json({error: error.message});
        }
    },
};

export default productController;