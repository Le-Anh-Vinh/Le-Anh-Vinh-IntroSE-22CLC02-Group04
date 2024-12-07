import db from '../config/db.js';
import { getDoc, collection, addDoc, doc } from 'firebase/firestore';

const reportData = {
    addNew: async (report) => {
        try {
            await addDoc(collection(db, 'report'), report);
            return { status: true };

        } catch (e) {
            console.error("Error adding document: ", e);
            return { status: false, error: e.message };
        }
    },

    get: async (id) => {
        const reportRef = doc(db, 'report', id);
        const docSnap = await getDoc(reportRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    },
    
};

export default reportData;
