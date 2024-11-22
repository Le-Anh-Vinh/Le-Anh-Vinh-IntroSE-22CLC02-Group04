import { db, auth } from '../config/db.js';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import MyError from '../cerror.js';

const productController = {
    getAddProduct: async (req, res, next) => {
        try {
            res.render('addProduct');
        } catch (error) {
            next(new MyError(404, "Can't found add product page"));
        }
    },

    getUpdateProduct: async (req, res, next) => {
        try {
            res.render('updateProduct');
        } catch (error) {
            next(new MyError(404, "Can't found update product page"));
        }
    },

    addProduct: async (req, res, next) => {
        try {
            const formInput = req.body;
            const productCollection = collection(db, 'product');
            const q = query(productCollection, where('productID', '==', formInput.productID));
            const productSnapshot = await getDocs(q);

            if (!productSnapshot.empty) {
                return res.json({ success: false, message: 'Product ID already exists' });
            }

            await addDoc(productCollection, {
                productID: formInput.productID,
                productName: formInput.productName,
                productDescription: formInput.productDescription,
                productPrice: formInput.productPrice,
                productQuantity: formInput.productQuantity,
                productImage: formInput.productImage,
                productStatus: formInput.productStatus,
                storeID: formInput.storeID
            });

            return res.json({ success: true, message: 'Product was added successfully' });

        } catch (error) {
            console.error("Error in adding product:", error);
            next(new MyError(404, "There was something wrong with adding product"));
        }
    },

    updateProduct: async (req, res, next) => {
        try {
            const formInput = req.body;
            console.log(formInput);
            const productCollection = collection(db, 'product');
            const q = query(productCollection, where('productID', '==', formInput.productID));
            const productSnapshot = await getDocs(q);

            if (productSnapshot.empty) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            const productDoc = productSnapshot.docs[0];

            await updateDoc(productDoc.ref, {
                productName: formInput.productName,
                productPrice: formInput.productPrice,
                productQuantity: formInput.productQuantity,
                productDescription: formInput.productDescription,
                productStatus: formInput.productStatus,
                storeID: formInput.storeID
            });
            return res.json({ success: true, message: 'Product updated successfully' });

        } catch (error) {
            console.error("Error in updating product:", error);
            next(new MyError(404, "There was something wrong with updating product"));
        }
    }
};

export default productController;