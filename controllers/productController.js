import db from '../config/db.js';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import MyError from '../cerror.js';
import productData from '../models/products.js';
import user from '../models/users.js';

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
            const relativeCollection = collection(db, 'product');
            const rq = query(
                relativeCollection,
                where('category', 'in', categoryValues));
            const relativeSnapshot = await getDocs(rq);
            const relativeProducts = [];

            if (!relativeSnapshot.empty) {
                relativeSnapshot.forEach((doc) => {
                    const product = doc.data();
                    if (product.product_id !== procID) {
                        relativeProducts.push(product);
                    }
                });
            }
            // take relative products
            
            res.render('productDetails', {
                product: productDoc,                // product information
                store: storeDoc,                    // store information
                relativeProducts: relativeProducts  // relative products
            });
        } catch (error) {
            res.json({ success: false, error: error });
            console.error("Error:", error.message);
            console.error("Stack:", error.stack);
            new MyError(500, "There was something wrong with product detail");
        }
    }   
};

export default productController;