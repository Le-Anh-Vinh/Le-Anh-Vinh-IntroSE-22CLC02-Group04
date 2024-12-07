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

};

export default productController;