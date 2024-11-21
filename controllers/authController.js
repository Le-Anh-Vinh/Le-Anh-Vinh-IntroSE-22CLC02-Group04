import db from '../config/db.js';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const login = async (req, res) => {
    res.send('Hello World');
};

const signup = async (req, res) => {
};

export { login, signup };