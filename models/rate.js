import db from '../config/db.js';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const rate = {
    all: async () => {
        const rateCollection = collection(db, 'rate');
        const rateSnapshot = await getDocs(rateCollection);
        
        return rateSnapshot;
    },

    storeRate: async (storeID) => {
        const rateCollection = collection(db, 'rate');
        const q = query(rateCollection, where('storeID', '==', storeID));
        const rateSnapshot = await getDocs(q);

        return rateSnapshot;
    },

    productRate: async (productID) => {
        const rateCollection = collection(db, 'rate');
        const q = query(rateCollection, where('productID', '==', productID));
        const rateSnapshot = await getDocs(q);

        return rateSnapshot;
    }
};

export default rate;