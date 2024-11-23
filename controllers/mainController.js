import productData from '../models/products.js';
import MyError from '../cerror.js';

const mainController = {
    getAll: async (req, res, next) => {
        //get uid => auth/main
        //get role => phân hệ
        try {
            const products = await productData.all();
            console.log(products);

            res.render('home' , { products });
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