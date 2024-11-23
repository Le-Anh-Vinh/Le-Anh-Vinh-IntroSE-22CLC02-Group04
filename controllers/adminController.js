import db from '../config/db.js';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import MyError from '../cerror.js';

const adminController = {};

export default adminController;