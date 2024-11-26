import db from '../config/db.js';
import { collection, doc, getDoc, getDocs, updateDoc, setDoc } from 'firebase/firestore';

const userData = {
    all: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'user'));
            return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        } catch (e) {
            console.error("Error fetching users: ", e);
            throw new Error('Failed to fetch users');
        }
    },

    get: async (uid) => {
        try {
            const userRef = doc(db, 'user', uid);
            const docSnap = await getDoc(userRef);
            return docSnap.exists() ? { uid: docSnap.id, ...docSnap.data() } : null;
        } catch (e) {
            console.error(`Error fetching user with ID ${uid}:`, e);
            throw new Error('Failed to fetch user');
        }
    },

    update: async (uid, newUpdate) => {
        try {
            const userRef = doc(db, 'user', uid);
            await updateDoc(userRef, newUpdate);
            return { status: true };
        } catch (e) {
            console.error(`Error updating user with ID ${uid}:`, e);
            return { status: false, error: e.message };
        }
    },

    new: async (uid, user) => {
        try {
            const userRef = doc(collection(db, 'user'), uid);
            await setDoc(userRef, user);

            return { status: true, uid: userRef.id };
        } catch (e) {
            console.error("Error adding document: ", e);
            return { status: false, error: e.message };
        }
    }
};

export default userData;