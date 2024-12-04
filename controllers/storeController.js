import MyError from '../cerror.js';
import productData from '../models/products.js';
import orderData from '../models/oders.js';

const storeController = {
    getStore: async (req, res, next) => {},
    
    addNewProduct: async (req, res, next) => {
        try {
            const { name, description, price, quantity, status, images, category, store_id, variant } = req.body;

            product = {
                product_id: '',
                name: name, 
                description: description, 
                price: parseInt(price), 
                quantity: parseInt(quantity), 
                status: status, 
                images: images, 
                category: category, 
                store_id: store_id,
                variant: variant
            };

            const { id } = await productData.add(product);

            res.json({ status: true, id: id });
            
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    updateProduct: async (req, res, next) => {
        try {
            const { product_id, name, description, price, quantity, status, images, category, store_id, variant } = req.body;

            product = {
                name: name, 
                description: description, 
                price: parseInt(price), 
                quantity: parseInt(quantity), 
                status: status, 
                images: images, 
                category: category, 
                store_id: store_id,
                variant: variant
            };

            const { id } = await productData.update(product_id, product);

            res.json({status: true, id: id});
            
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    removeProduct: async (req, res, next) => {
        try {
            const { product_id } = req.body;

            await productData.delete(product_id);
            
            res.json({status: true});
            
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    viewOrder: async (req, res, next) => {
        try {
            const store_id = req.param.id;
            const orders = orderData.get(store_id);
            res.json({orders});
        } catch (error) {
            next(new MyError(500, "There something went wrong with database", error.message));
        }
    },

    viewPendingOrder: async (req, res, next) => {
        try {
            const store_id = req.param.id;
            const orders = orderData.getPending(store_id);
            res.json({orders});
        } catch (error) {
            next(new MyError(500, "There something went wrong with database", error.message));
        }
    },

    confirmOrder: async (req, res, next) => {
        try {
            const {id, confirm} = req.body.order;
            const { order } = await orderData.update(id, confirm ? "confirmed" : "declined");
            for(const item in order.product_cart) {
                const product = await productData.get(item.product_id);
                await productData.update(item.product_id, {quantity: product.quantity - item.quantity});
            }
            json.res({status: true});
        } catch (error) {
            json.status(500).json({error: error.message});
        }
    },

    changeInformation: async (req, res, next) => {
        try {
            const {store_id, email, info, name} = req.body;
            const newData = {};
            if (name) newData.name = name;
            if (email) newData.email = email;
            if (gender) newData.gender = gender;
            if (info) newData.info = info;

            const user = await userData.update(uid, newData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

export default storeController;