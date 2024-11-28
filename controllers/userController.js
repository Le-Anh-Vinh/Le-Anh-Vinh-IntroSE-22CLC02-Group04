import productData from '../models/products.js';
import cartData from '../models/carts.js';
import orderData from '../models/oders.js';
import userData from '../models/users.js';
import MyError from '../cerror.js';

const mainController = {
    getAll: async (req, res, next) => {
        //get uid => auth/main
        //get role => phân hệ
        try {
            const products = await productData.all();

            res.render('home', {products});
        } catch (error) {
            next(new MyError(error.status, error.message));
        }
    },

    getProduct: async (req, res, next) => {
        try {
            const id = req.params.id;
            const product = await productData.get(id);

            res.render('product', {product});
        } catch (error) {
            next(new MyError(error.status, error.message));
        }
    },

    getProfile: async (req, res, next) => {
        try {
            const id = req.params.id;
            const data = await userData.get(id);

            if (data.role == 'user') {
                const { uid, ...user } = data;
                res.render('userProfile', {user});
                console.log(user);
            } else if (data.role === 'store') {
                const { store_id, ...store } = data;
                res.render('shopProfile', {store});
            } else {
                res.render('adminProfile', {data});
            }
        } catch (error) {
            next(new MyError(error.status, error.message));
        }
    },

    getStore: async (req, res, next) => {

    },

    search: async (req, res, next) => {
        try {
            const { query } = req.params;
            const { maxPrice, minPrice, rateFilter, page } = req.query;
            const filters = [];
            filters.push({ field: 'price', from: parseInt(minPrice, 10) || 0, to: parseInt(maxPrice, 10) || Infinity });
            filters.push({ field: 'rate', from: parseInt(rateFilter, 10) || 0, to: 5 });

            const products = await productData.searchAndFilter(query, 'all', filters);

            res.render('search_page', { products });
        } catch (error) {
            next(new MyError(error.status, error.message));
        }
    },

    addToCart: async (req, res, next) => { },

    addRating: async (req, res, next) => { },

    viewHistoryOrder: async (req, res, next) => { },
    addNewAddress: async (req, res, next) => { },
    checkOut: async (req, res, next) => { },
};

export default mainController;