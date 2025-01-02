import db from '../config/db.js';
import { getDoc, collection, addDoc, doc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import productData from './products.js';


const reportData = {
    addNew: async (report) => {
        try {
            const date = new Date();
            report.date = Timestamp.fromDate(date);
            const reportWithDate = {
                ...report,
                date: date,
                status: "pending"
            }
            const docRef = await addDoc(collection(db, 'report'), reportWithDate);
            await updateDoc(docRef, { id: docRef.id });
            return { status: true };
        } catch (e) {
            console.error("Error adding document: ", e);
            return { status: false, error: e.message };
        }
    },

    update: async (id, status) => {
        try {
            const reportRef = doc(db, 'report', id);
            const reportSnapshot = await getDoc(reportRef);

            if (!reportSnapshot.exists()) {
                return { status: false, error: "Report not found" };
            }

            await updateDoc(reportRef, { status: status });
            
            // penalize store if report was accepted
            // if there are 3 confirmed reports for the store, delete all products from the store
            const report = reportSnapshot.data();
            const store_id = report.store_id;
            if (status == "accepted") {
                const storeRef = doc(db, 'user', store_id);
                const storeSnapshot = await getDoc(storeRef);
                if (!storeSnapshot.exists()) {
                    return { status: false, error: "Store not found" };
                }
                const confirmedReportsQuery = query(collection(db, 'report'),
                    where('store_id', '==', store_id),
                    where('status', '==', 'accepted')
                );
                const confirmedReportsSnapshot = await getDocs(confirmedReportsQuery);
                if (confirmedReportsSnapshot.size >= 3) {
                    const productQuery = query(collection(db, 'product'), where('store_id', '==', store_id));
                    const productSnapshot = await getDocs(productQuery);

                    const deleteProductPromises = productSnapshot.docs.map(async (productDoc) => {
                        await productData.delete(productDoc.id);
                    });

                    await Promise.all(deleteProductPromises);
                }
            }
            return { status: true };
        } catch (error) {
            console.error("Error updating report status: ", error);
            return { status: false, error: error.message };
        }
    },

    get: async (id) => {
        const reportRef = doc(db, 'report', id);
        const docSnap = await getDoc(reportRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    },
    
    getAll: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'report'));
            return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error("Error fetching all reports: ", e);
            return { status: false, error: e.message };
        }
    },

    getPending: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'report'), where('status', '==', 'pending'));
            return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error("Error fetching pending reports: ", e);
            return { status: false, error: e.message };
        }
    }
};

export default reportData;
