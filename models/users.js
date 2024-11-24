import db from '../config/db.js';
import { collection, doc, getDoc, getDocs, updateDoc, setDoc } from 'firebase/firestore';

const userData = {
    all: async () => {
        const querySnapshot = await getDocs(collection(db, 'user'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    one: async (id) => {
        const userRef = doc(db, 'user', id);
        const docSnap = await getDoc(userRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    },

    update: async (id, newUpdate) => {
        const userRef = doc(db, 'user', id);
        await updateDoc(userRef, newUpdate);
        return { status: true };
    },

    add: async (user) => {
        try {
            const userRef = doc(collection(db, 'user'), user.uid);
            await setDoc(userRef, user);

            return { status: true, id: userRef.id };
        } catch (e) {
            console.error("Error adding document: ", e);
            return { status: false, error: e.message };
        }
    }
};

export default userData;