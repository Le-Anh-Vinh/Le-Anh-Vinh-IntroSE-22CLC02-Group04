import db from '../config/db.js';
import { updateDoc, addDoc, query, where, collection, getDoc, getDocs } from 'firebase/firestore';
import productData from './products.js';

const orderData = {
    addNew: async (order) => {
        try {
            const orderRef = await addDoc(collection(db, 'order'), order);
            await updateDoc(orderRef, { id: orderRef.id });
            return { status: true, id: orderRef.id };
        } catch (e) {
            console.error("Error adding document: ", e);
            return { status: false, error: e.message };
        }
    },

    get: async (uid) => {
        try {
            const query1 = query(collection(db, 'order'), where('customer_id', '==', uid));
            const query2 = query(collection(db, 'order'), where('store_id', '==', uid));

            const [snapshot1, snapshot2] = await Promise.all([getDocs(query1), getDocs(query2)]);

            const orders = [...snapshot1.docs, ...snapshot2.docs].map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return { status: true, order: orders }

        } catch (error) {
            console.error("Error getting document: ", error);
            return { status: false, error: error.message };
        }
    },

    getPending: async (uid) => {
        try {
            const query1 = query(collection(db, 'order'), where('customer_id', '==', uid), where('status', '==', 'pending'));
            const query2 = query(collection(db, 'order'), where('store_id', '==', uid), where('status', '==', 'pending'));

            const [snapshot1, snapshot2] = await Promise.all([getDocs(query1), getDocs(query2)]);

            const orders = [...snapshot1.docs, ...snapshot2.docs].map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return { status: true, orders: orders }

        } catch (error) {
            console.error("Error getting document: ", error);
            return { status: false, error: error.message };
        }
    },

    update: async (id, status) => {
        try {
            const orderRef = doc(db, 'order', id);
            await updateDoc(orderRef, { done: status });
            const order = await getDoc(orderRef);
            return { status: true, order};
        } catch (error) {
            console.error("Error updating order: ", error);
            return { status: false, error: error.message };
        }
    }
};

export default orderData;
