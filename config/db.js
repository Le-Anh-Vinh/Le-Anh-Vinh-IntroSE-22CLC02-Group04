import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import config from './config.js'

const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app);

export default db;