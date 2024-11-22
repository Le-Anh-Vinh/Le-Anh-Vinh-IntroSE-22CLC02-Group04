import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import config from './config.js'

const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth};