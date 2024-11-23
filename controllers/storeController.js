import db from '../config/db.js';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import MyError from '../cerror.js';

const storeController = {
    createNewStore: async (req, res, next) => {},
    addNewProduct: async (req, res, next) => {},
    removeProduct: async (req, res, next) => {},
    viewOrder: async (req, res, next) => {},
    changeInformation: async (req, res, next) => {},
};

export default storeController;