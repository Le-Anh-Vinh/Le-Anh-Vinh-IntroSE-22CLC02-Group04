import productData from '../models/products.js';
import MyError from '../cerror.js';

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
    viewOrder: async (req, res, next) => {},
    changeInformation: async (req, res, next) => {},
};

export default storeController;