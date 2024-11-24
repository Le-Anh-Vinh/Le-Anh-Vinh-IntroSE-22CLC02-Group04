import db from '../config/db.js';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import MyError from '../cerror.js';
import averageRate from '../utils/rate/averageRate.js';
import productData from '../models/product.js';
import variation from '../models/product_variation.js';
import user from '../models/user.js';

const productController = {
    // getAddProduct: async (req, res, next) => {
    //     try {
    //         res.render('addProduct');
    //     } catch (error) {
    //         next(new MyError(404, "Can't found add product page"));
    //     }
    // },

    // getUpdateProduct: async (req, res, next) => {
    //     try {
    //         res.render('updateProduct');
    //     } catch (error) {
    //         next(new MyError(404, "Can't found update product page"));
    //     }
    // },

    // addProduct: async (req, res, next) => {
    //     try {
    //         const formInput = req.body;
    //         const productCollection = collection(db, 'product');
    //         const q = query(productCollection, where('productID', '==', formInput.productID));
    //         const productSnapshot = await getDocs(q);

    //         if (!productSnapshot.empty) {
    //             return res.json({ success: false, message: 'Product ID already exists' });
    //         }

    //         await addDoc(productCollection, {
    //             productID: formInput.productID,
    //             productName: formInput.productName,
    //             productDescription: formInput.productDescription,
    //             productPrice: formInput.productPrice,
    //             productQuantity: formInput.productQuantity,
    //             productImage: formInput.productImage,
    //             productStatus: formInput.productStatus,
    //             storeID: formInput.storeID
    //         });

    //         return res.json({ success: true, message: 'Product was added successfully' });

    //     } catch (error) {
    //         console.error("Error in adding product:", error);
    //         next(new MyError(404, "There was something wrong with adding product"));
    //     }
    // },

    // updateProduct: async (req, res, next) => {
    //     try {
    //         const formInput = req.body;
    //         console.log(formInput);
    //         const productCollection = collection(db, 'product');
    //         const q = query(productCollection, where('productID', '==', formInput.productID));
    //         const productSnapshot = await getDocs(q);

    //         if (productSnapshot.empty) {
    //             return res.status(404).json({ success: false, message: 'Product not found' });
    //         }

    //         const productDoc = productSnapshot.docs[0];

    //         await updateDoc(productDoc.ref, {
    //             productName: formInput.productName,
    //             productPrice: formInput.productPrice,
    //             productQuantity: formInput.productQuantity,
    //             productDescription: formInput.productDescription,
    //             productStatus: formInput.productStatus,
    //             storeID: formInput.storeID
    //         });
    //         return res.json({ success: true, message: 'Product updated successfully' });

    //     } catch (error) {
    //         console.error("Error in updating product:", error);
    //         next(new MyError(404, "There was something wrong with updating product"));
    //     }
    // }
    getDetailProduct: async (req, res, next) => {
        try {
            res.render('detailProduct');
        } catch (error) {
            new MyError(404, "Can't found detail product page");
        }
    },

    detailProduct: async (req, res, next) => {
        try {
            const formInput = req.body;
            // handle product information
            const productDoc = await productData.one(formInput.productID);
            if (!productDoc) {
                new MyError(404, "Product not found");
            }

            // product information
            const productName = productDoc.productName;
            const productPrice = productDoc.productPrice;
            const productDescription = productDoc.productDescription;
            const productImage = productDoc.productImage;
            const storeID = productDoc.storeID;

            // handle store information
            const storeDoc = await user.storeOne(storeID);
            if (!storeDoc) {
                new MyError(404, "Store not found");
            }
            // store information
            const storeName = storeDoc.docs().name;
            const storeRate = storeDoc.docs().rate;

            // handle product variation
            const variantSnapshot = await variation.productVariation(formInput.productID);
            // take all variant value if it exists
            const productVariants = [];
            if (!variantSnapshot) {
                variantSnapshot.forEach((doc) => {
                    productVariants.push(doc.data().value);
                })
            }

            // handle product average rate
            const { recentRates, avgRate } = await averageRate(formInput.productID);
            
            // handle relative products
            const productCategory = productDoc.categoryID;
            const relativeCollection = collection(db, 'product');
            const rq = query(relativeCollection, where('categoryID', '==', productCategory), where('productID', '!=', formInput.productID), limit(3));
            const relativeSnapshot = await getDocs(rq);

            // take relative products
            const relativeProducts = [];
            if (!relativeSnapshot.empty) {
                relativeSnapshot.forEach((doc) => { 
                    relativeProducts.push(doc.data());
                });
            }
            
            res.status(200).json({
                success: true,
                productName: productName,
                productPrice: productPrice,
                productDescription: productDescription,
                productImage: productImage,         //url
                storeName: storeName,
                storeRate: storeRate,
                productVariants: productVariants,   //arr
                recentRates: recentRates,           //arr (3 lastest rate)
                avgRate: avgRate,
                relativeProducts: relativeProducts
            })
        } catch (error) {
            res.json({ success: false, error: error });
            new MyError(500, "There was something wrong with product detail");
        }
    }   
};

export default productController;