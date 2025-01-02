import db from '../config/db.js';
import { getDocs, collection, addDoc, doc, getDoc } from 'firebase/firestore';

const categoryData = {
    getAll: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'category'));
            return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error("Error fetching all products: ", e);
            return [];
        }
    },

    addNew: async (category) => {
        try {
            await addDoc(collection(db, 'category'), category);
            return { status: true };

        } catch (e) {
            console.error("Error adding document: ", e);
            return { status: false, error: e.message };
        }
    },

    get: async (id) => {
        try {
            const categoryRef = doc(db, 'category', id);
            const docSnap = await getDoc(categoryRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                throw new Error("No such document!");
            }
        } catch (e) {
            console.error("Error fetching product: ", e.message);
            return { status: false, error: e.message };
        }
    }
};

export default categoryData;
