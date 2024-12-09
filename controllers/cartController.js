import productData from '../models/products.js';
import cartData from '../models/carts.js';
import orderData from '../models/oders.js';
import MyError from '../cerror.js';
import { Timestamp } from 'firebase/firestore';

const cartController = {
    getCart: async (req, res, next) => {
        try {
            const id = req.params.id;
            const cart = await cartData.get(id);

            const products = cart.cart.product_cart;
            const productsWithDetails = await Promise.all(
                products.map(async (product) => {
                    const productDetails = await productData.get(product.product_id);
                    return {
                        ...product,
                        productDetails: productDetails || {}
                    };
                })
            );
            res.render('cart', { products: productsWithDetails});
        } catch (error) {
            next(new MyError(error.status, error));
        }
    },

    viewHistoryOrder: async (req, res, next) => { 
        try {
            const id = req.params.id;
            const orders = orderData.get(id);
            res.render('order', { orders })
        } catch (error) {
            next(new MyError(error.status, error.message));
        }
    },

    addToCart: async (req, res, next) => {
        try {
            const uid = req.params.id;
            const { product } = req.body;
            await cartData.add(uid, product);
            res.json({status: true});    
        } catch (error) {
            console.error(error.mesage);
            json.status(500).json({error: error.mesage});            
        }
    },

    updateItem: async (req, res, next) => {
        try {
            const uid = req.params.id;
            const product = req.body;
            const cart = await cartData.update(uid, product);
            res.json({cart});
        } catch (error) {
            console.error(error.mesage);
            json.status(500).json({error: error.mesage});            
        }  
    },

    removeItem: async (req, res, next) => {
        try {
            const uid = req.params.id;
            const product = req.body;
            const cart = await cartData.delete(uid, product);
            res.json({cart});
        } catch (error) {
            console.error(error.mesage);
            res.status(500).json({error: error.mesage});            
        }  
    },
    
    checkOut: async (req, res, next) => { 
        try {
            const uid = req.params.id;
            const { products, info } = req.body;
            const storeOrders = {};
            //create store orders
            for (const item of products) {
                const product = await productData.get(item.product_id);
                const storeId = product.store_id;
                const date = new Date();
                // date.setHours(0, 0, 0, 0);

                if (!storeOrders[storeId]) {
                    storeOrders[storeId] = {
                        status: 'pending',
                        customer_id: uid,
                        store_id: storeId,
                        product_cart: [],
                        date: Timestamp.fromDate(date),
                        info: info,
                        total: 0
                    };
                }
                storeOrders[storeId].product_cart.push({
                    id: item.product_id,
                    quantity: item.quantity,
                    variant: item.variant
                });
                storeOrders[storeId].total += item.quantity * product.price
            }
            res.json({status: true});

            for (const storeId in storeOrders) {
                await orderData.addNew(storeOrders[storeId]);
                for (const product of storeOrders[storeId].product_cart) {
                    await cartData.delete(uid, product);
                }
            }

        } catch (error) {
            console.error(error.mesage);
            res.status(500).json({error: error.mesage});
        }
    },


};

export default cartController;