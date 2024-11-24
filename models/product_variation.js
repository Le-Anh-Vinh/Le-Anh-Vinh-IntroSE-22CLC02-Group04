import db from '../config/db.js';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const variation = {
    productVariation: async (productID) => {
        const variationCollection = collection(db, 'product_variation');
        const q = query(variationCollection, where('productID', '==', productID));
        const variationSnapshot = await getDocs(q);

        return variationSnapshot;
    }
}

export default variation;