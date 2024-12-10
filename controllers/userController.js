import productData from '../models/products.js';
import cartData from '../models/carts.js';
import orderData from '../models/oders.js';
import categoryData from '../models/category.js';
import userData from '../models/users.js';
import MyError from '../cerror.js';

const mainController = {
    getAll: async (req, res, next) => {
        try {
            const id = req.params.id;
            const user = await userData.get(id);
            if (user.role === 'user') {
                const page = parseInt(req.query.page) || 1;
                if (page < 0) {
                    return next(new MyError(404, "Page not found!"));
                }
                const catID = req.query.catID || '';
                const per_page = 20;
                let products;
                if (catID != '') {
                    const category = await categoryData.get(catID);
                    
                    products = await productData.search(category.name, 'category');
                }

                products = await productData.all();
                const total_page = Math.ceil(products.length / per_page);

                if (page > total_page) {
                    return next(new MyError(404, "The page you looking for can't be found!"));
                }
                products = products.slice((page - 1) * per_page, Math.min(page * per_page, products.length));
                const categories = await categoryData.getAll();
                res.render('homepage', { products, page, total_page, catID, category: categories });
            }
            else if (user.role === 'store') {
                const products = await productData.getByStore(user.store_id);
                res.render('shopownerhomepage', { products: products });
            }
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
                res.render('userProfile', { user });
                console.log(user);
            } else if (data.role === 'store') {
                const { store_id, ...store } = data;
                res.render('shopProfile', { store });
            } else {
                res.render('adminProfile', { data });
            }
        } catch (error) {
            next(new MyError(error.status, error.message));
        }
    },

    getStore: async (req, res, next) => {
        try {
            const storeID = req.params.id;
            
            const storeDoc = await userData.get(storeID);

            if (!storeDoc) {
                new MyError(404, "Store not found");
            }

            const productDoc = await productData.getByStore(storeID);

            res.render('storePage', {
                product: productDoc,
                store: storeDoc
            });
        } catch (error) {
            next(new MyError(error.status, error.message));
        }
    },

    search: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;   
            if(page < 0) {
                return next(new MyError(404, "The page you looking for can't be found!"));
            }

            const { query } = req.params;
            const { maxPrice, minPrice, rateFilter } = req.query;
            const per_page = 1;
            const filters = [];
            filters.push({ field: 'price', from: parseInt(minPrice, 10) || 0, to: parseInt(maxPrice, 10) || Infinity });
            filters.push({ field: 'rate', from: parseInt(rateFilter, 10) || 0, to: 5 });
            let products = await productData.searchAndFilter(query, 'all', filters);
            
            const total_page = Math.ceil(products.length / per_page);

            // if(page > total_page) {
            //     return next(new MyError(404, "The page you looking for can't be found!"));
            // }
            // products = products.slice((page - 1) * per_page, Math.min(page * per_page, products.length));

            res.render('searchpage', { products, page, total_page, query });
        } catch (error) {
            next(new MyError(error.status, error.message));
        }
    },

    addNewAddress: async (req, res, next) => { },
    
    changeUserInfo: async (req, res, next) => {
        try {
            const { uid, username, name, email, gender, info } = req.body;
            const newData = {};
            if (username) newData.username = displayName;
            if (name) newData.name = name;
            if (email) newData.email = email;
            if (gender) newData.gender = gender;
            if (info) newData.info = info;
            
            await userData.update(uid, newData);

            res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },

    changeStoreInfo: async (req, res, next) => {
        try {
            const { uid, username, name, email, gender, info } = req.body;
            const newData = {};
            if (username) newData.username = displayName;
            if (name) newData.name = name;
            if (email) newData.email = email;
            if (info) newData.info = info;

            newData.rate = parseInt(0);
            
            await userData.update(uid, newData);

            res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },

    getPayment: async (req, res, next) => { 
        try {
            const id = req.params.id;
            const cart = await cartData.get(id);

            const products = cart.cart.product_cart;
            const productsWithDetails = await Promise.all(
                products.map(async (product) => {
                    const productDetails = await productData.get(product.product_id);
                    return {
                        ...product,
                        productDetails: productDetails || {}
                    };
                })
            );

            const productTick = [];
            for (const product of productsWithDetails) {
                if (product.tick === true) {
                   productTick.push(product);
                }
            }
            
            const user = await userData.get(id);
            const shipInfo = user.info;
            res.render('payment', ({ product: productTick, info: shipInfo, total: cart.cart.value}));
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },
};

export default mainController;