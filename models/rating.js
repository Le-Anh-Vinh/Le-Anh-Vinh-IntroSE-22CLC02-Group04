import db from '../config/db.js';
import { getDocs, updateDoc, where, query, collection } from 'firebase/firestore';

const rateData = {    
    all: async (id) => {
        try {
            const q = query(collection(db, 'rate'), where('productID', '==', id));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting documents: ", error);
            return { status: false, error: error.message };
        }
    },    

    update: async (product_id, customer_id, newUpdate) => {
        const q = query(
            collection(db, 'rate'),
            where('product_id', '==', product_id),
            where('customer_id', '==', customer_id)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;

            await updateDoc(docRef, newUpdate);
            return { status: true };
        } else {
            return { status: false, error: error.message };
        }
    },  

    add: async (review) => {
        try {
            await addDoc(collection(db, 'rate'), review);
            const avgRate = await rateData.getAvg(review.product_id);
            return { status: true, avgRate: avgRate };
        } catch (e) {
            console.error("Error adding document: ", e);
            return { status: false, error: e.message };
        }
    },    

    getAvg: async (id) => {
        const reviews = await rateData.all(id);
        let sum = 0;
        const length = reviews.length;
        for(let i = 0; i < length; i++) {
            sum += reviews[i].rate;
        }
        return length > 0 ? sum / length : ''; 
    }
};

export default rateData;
