import db from '../config/db.js';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import MyError from '../cerror.js';

const mainController = {
    getAll: async (req, res, next) => {
        //get uid => auth/main
        //get role => phân hệ
        try {
            res.render('home');
        } catch (error) {
            next(new MyError(404, "Can't found Home page"));
        }
    },
    search: async (req, res, next) => {},
    addToCart: async (req, res, next) => {},
    filterProduct: async (req, res, next) => {},
    viewHistoryOrder: async (req, res, next) => {},
    addNewAddress: async (req, res, next) => {},
    checkOut: async (req, res, next) => {},
};

export default mainController;