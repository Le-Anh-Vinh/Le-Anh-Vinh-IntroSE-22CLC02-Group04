import db from '../config/db.js';
import { updateDoc, doc, collection, setDoc, getDoc, arrayUnion } from 'firebase/firestore';
import productData from './products.js';

const cartData = {
    fetchCart: async (uid) => {
        try {
            const cartRef = doc(db, 'cart', uid);
            const docSnap = await getDoc(cartRef);
            return docSnap.exists() ? docSnap.data() : null;
        } catch (e) {
            console.error(`Error fetching cart for user ${uid}:`, e);
            throw new Error('Failed to fetch cart');
        }
    },

    new: async (uid) => {
        try {
            const cart = {
                product_cart: [],
                value: 0
            };
            const cartRef = doc(collection(db, 'cart'), uid);
            await setDoc(cartRef, cart);
            return { status: true };
        } catch (e) {
            console.error(`Error creating cart for user ${uid}:`, e);
            return { status: false, error: e.message };
        }
    },

    get: async (uid) => {
        try {
            const cartDataFetched = await cartData.fetchCart(uid);
            return cartDataFetched
                ? { status: true, cart: cartDataFetched }
                : { status: false, error: 'Cart not found' };
        } catch (e) {
            return { status: false, error: e.message };
        }
    },

    calValue: async (uid) => {
        try {
            const cartDataFetched = await cartData.fetchCart(uid);
            if (!cartDataFetched) return { status: false, error: 'Cart not found' };

            const productsCart = cartDataFetched.product_cart || [];
            const products = await productData.all();

            const value = productsCart.reduce((total, item) => {
                const product = products.find((p) => p.product_id === item.product_id);
                return product ? total + product.price * item.quantity * (item.tick ? 1 : 0) : total;
            }, 0);

            const cartRef = doc(db, 'cart', uid);
            await updateDoc(cartRef, { value });

            return { status: true, value };
        } catch (e) {
            console.error(`Error calculating value for cart of user ${uid}:`, e);
            return { status: false, error: e.message };
        }
    },

    add: async (uid, product) => {
        try {
            const cartRef = doc(db, 'cart', uid);
            const cartSnap = await getDoc(cartRef);
    
            if (cartSnap.exists()) {
                const cartData = cartSnap.data();
                const productCart = cartData.product_cart || [];
                const productDataGet = await productData.get(product.product_id);
                const productImage = productDataGet.images[0];
                const existingID = productCart.findIndex(p => p.product_id === product.product_id && p.variant === product.variant);
                const newData = [...productCart];

                if (existingID !== -1) {
                    newData[existingID] = {
                        ...newData[existingID],
                        quantity: newData[existingID].quantity + (product.quantity || 1),
                        image: productImage,
                        tick: false
                    };
                } else {
                    newData.push({
                        ...product,
                        quantity: product.quantity || 1,
                        image: productImage,
                        tick: false
                    });
                }

                await updateDoc(cartRef, { product_cart: newData });
    
                return { status: true, message: "Product was added to cart" };
            } else {
                console.error(`No cart document found for user: ${uid}`);
                return { status: false, error: "No such document!" };
            }
        } catch (e) {
            console.error(`Error updating cart for user ${uid}:`, e);
            return { status: false, error: e.message };
        }
    },
    
    update: async (uid, newData) => {
        try {
            const cartDataFetched = await cartData.fetchCart(uid);
            if (!cartDataFetched) return { status: false, error: 'Cart not found' };
            
            const updatedProducts = cartDataFetched.product_cart.map((product) =>
                product.product_id === newData.product_id && product.variant === newData.variant ? { ...product, ...newData } : product
            );

            const cartRef = doc(db, 'cart', uid);
            await updateDoc(cartRef, { product_cart: updatedProducts });

            const valueResult = await cartData.calValue(uid);
            if (!valueResult.status) return valueResult;

            await updateDoc(cartRef, { value: valueResult.value });

            const cart = await getDoc(cartRef);
            return { status: true, cart };
        } catch (e) {
            console.error(`Error updating cart for user ${uid}:`, e);
            return { status: false, error: e.message };
        }
    },

    delete: async (uid, product) => {
        try {
            const cartDataFetched = await cartData.fetchCart(uid);
            if (!cartDataFetched) return { status: false, error: 'Cart not found' };

            const updatedProducts = cartDataFetched.product_cart.filter(
                (p) => p.product_id !== product.product_id && p.variant !== product.variant
            );

            const cartRef = doc(db, 'cart', uid);
            await updateDoc(cartRef, { product_cart: updatedProducts });

            const valueResult = await cartData.calValue(uid);
            if (!valueResult.status) return valueResult;

            await updateDoc(cartRef, { value: valueResult.value });

            return { status: true };
        } catch (e) {
            console.error(`Error deleting product from cart for user ${uid}:`, e);
            return { status: false, error: e.message };
        }
    },
};

export default cartData;
