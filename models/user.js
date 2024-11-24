import db from '../config/db.js';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const user = {
    all: async () => {
        const userCollection = collection(db, 'user');
        const userSnapshot = await getDocs(userCollection);
        
        return userSnapshot;    
    },

    customerOne: async (customerID) => {
        const customerCollection = collection(db, 'user');
        const q = query(customerCollection, where('role', '==', 'customer'), where('customerID', '==', customerID));
        const customerSnapshot = await getDocs(q);
        
        return customerSnapshot;
    },

    storeOne: async (storeID) => {
        const storeCollection = collection(db, 'user');
        const q = query(storeCollection, where('role', '==', 'store'), where('storeID', '==', storeID));
        const storeSnapshot = await getDocs(q);

        return storeSnapshot;
    }
}

export default user;