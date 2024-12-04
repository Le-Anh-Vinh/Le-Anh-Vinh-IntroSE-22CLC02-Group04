import db from '../config/db.js';
import { collection, doc, query, where, getDocs, updateDoc, deleteDoc, addDoc, getDoc, arrayUnion } from 'firebase/firestore';
import userData from './users.js';

const productData = {
    all: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'product'));
            return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error("Error fetching all products: ", e);
            return [];
        }
    },

    get: async (id) => {
        try {
            const productRef = doc(db, 'product', id);
            const docSnap = await getDoc(productRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                throw new Error("No such document!");
            }
        } catch (e) {
            console.error("Error fetching product: ", e);
            return null;
        }
    },

    getByStore: async (store_id) => {
        try {
            const docSnap = await getDocs(collection(db, 'product'), where('store_id', '==', store_id));

            const products = [];
            docSnap.forEach((doc) => {
                products.push({ id: doc.id, ...doc.data() });
            });
            return products;

        } catch (e) {
            console.error("Error fetching product: ", e);
            return null;
        }
    },

    search: async (queryStr, field = 'all') => {
        try {
            const productRef = collection(db, 'product');
            let q;

            if (field === 'name') {
                q = query(productRef, where(field, '>=', queryStr), where(field, '<=', queryStr + '\uf8ff'));
            } else if (field === 'category') {
                q = query(productRef, where(field, 'array-contains', queryStr));
            } else {

                const querySnapshot = await getDocs(productRef);
                const products = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                return products.filter((product) =>
                    product.name.toLowerCase().includes(queryStr.toLowerCase()) ||
                    product.category.some(cat => cat.toLowerCase().includes(queryStr.toLowerCase()))
                );
            }

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        } catch (e) {
            console.error("Error searching products: ", e);
            return [];
        }
    },

    searchAndFilter: async (queryStr = '', field = 'all', filters = []) => {
        try {
            let results = await productData.search(queryStr, field);

            results = filters.reduce((filteredData, { field, from, to }) => {
                return filteredData.filter((item) =>
                    (from === undefined || item[field] >= from) &&
                    (to === undefined || item[field] <= to)
                );
            }, results);

            return results;
        } catch (e) {
            console.error("Error in search and filter: ", e);
            return [];
        }
    },

    new: async (product) => {
        try {
            const productRef = await addDoc(collection(db, 'product'), product);
            const product_id = productRef.id;
            await updateDoc(productRef, { product_id });
            return { status: true, id: productRef.id };
        } catch (e) {
            console.error("Error adding product: ", e);
            return { status: false, error: e.message };
        }
    },

    update: async (id, newUpdate) => {
        try {
            const productRef = doc(db, 'product', id);
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
                const existingData = productSnap.data();
                const updatedReviews = arrayUnion(...(existingData.reviews || []), ...(newUpdate.reviews || []));
                newUpdate.reviews = updatedReviews;
                newUpdate.rate = productData.calRate(updatedReviews);
                await updateDoc(productRef, newUpdate);
                const products = productData.getByStore(existingData.store_id);
                let rate = products.reduce((arr, product) => arr + product.rate);
                rate /= products.length > 0? products.length : 1;
                await userData.update(existingData.store_id, {rate});
                return { status: true };
            } else {
                throw new Error("No such document!");
            }
        } catch (e) {
            console.error("Error updating product: ", e);
            return { status: false, error: e.message };
        }
    },

    calRate: (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const total = reviews.reduce((acc, review) => acc + (review.value || 0), 0);
        return total / reviews.length;
    },

    delete: async (id) => {
        try {
            const productRef = doc(db, 'product', id);
            await deleteDoc(productRef);
            return { status: true };
        } catch (e) {
            console.error("Error deleting product: ", e);
            return { status: false, error: e.message };
        }
    },
};

export default productData;