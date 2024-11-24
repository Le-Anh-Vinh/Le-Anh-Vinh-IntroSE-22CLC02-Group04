import productData from '../models/products.js';
import rateData from '../models/rating.js';
import userData from '../models/users.js';
import MyError from '../cerror.js';

const mainController = {
    getAll: async (req, res, next) => {
        //get uid => auth/main
        //get role => phân hệ
        try {
            
            const products = await productData.all();
            console.log(products);

            res.render('home', { products });
        } catch (error) {
            next(new MyError(404, "Can't found Home page"));
        }
    },

    getProduct: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const product = await productData.one(id);

            res.render('product', { product });
        } catch (error) {
            next(new MyError(404, "Can't found Home page"));
        }
    },

    getProfile: async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            const product = await userData.one(id);

            res.render('user_profile', { product });
        } catch (error) {
            next(new MyError(404, "Can't found Home page"));
        }
    },

    getStore: async (req, res, next) => {

    },

    search: async (req, res, next) => {
        try {
            const { query } = req.params;
            const { maxPrice, minPrice, ratingFilter, page } = req.query;
            const filters = [];
            if (maxPrice) filters.push({ field: 'price', to: parseInt(maxPrice, 10) || Infinity });
            if (minPrice) filters.push({ field: 'price', from: parseInt(minPrice, 10) || 0 });
            if (ratingFilter) {
                filters.push({ field: 'rate', from: parseInt(ratingFilter, 10) || 0 });
                filters.push({ field: 'rate', to: 5 });
            }

            const products = await productData.searchAndFilter(query, 'all', filters);

            res.render('search_page', { products });
        } catch (error) {
            next(new MyError(404, "Can't found Home page"));
        }
    },
    
    addToCart: async (req, res, next) => { },

    addRating: async (req, res, next) => {
        try {
            const review = req.body;
            await rateData.add(review);
            res.json({status: true});
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    viewHistoryOrder: async (req, res, next) => { },
    addNewAddress: async (req, res, next) => { },
    checkOut: async (req, res, next) => { },
};

export default mainController;