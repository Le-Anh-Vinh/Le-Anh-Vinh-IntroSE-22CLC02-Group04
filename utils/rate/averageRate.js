import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import db from '../../config/db.js';

export async function averageRate(productID) {
    const rateCollection = collection(db, 'rate');
    const q = query(rateCollection, where('productID', '==', productID), orderBy('rateDate', 'desc'));
    const rateSnapshot = await getDocs(q);

    if (rateSnapshot.empty) {
        return {
            rates: [],
            average: 0};
    }

    const rates = [];

    rateSnapshot.forEach((doc) => {
        rates.push(doc.data().rate);
    });

    const recentRates = rates.slice(0, 3);

    return {
        rates: recentRates,
        average: rates.reduce((a, b) => a + b, 0) / rates.length || 0
    };
}