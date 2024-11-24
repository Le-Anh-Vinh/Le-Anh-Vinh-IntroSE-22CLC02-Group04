import productData from '../models/products.js';
import MyError from '../cerror.js';

const storeController = {
    getStore: async (req, res, next) => {},
    addNewProduct: async (req, res, next) => {},
    updateProduct: async (req, res, next) => {
        try {
            const { product_id, newUpdate } = req.body;

            const docRef = db.collection('product').doc(product_id);
            await docRef.update({ newUpdate });
            res.json({status: true});
            
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },
    removeProduct: async (req, res, next) => {},
    viewOrder: async (req, res, next) => {},
    changeInformation: async (req, res, next) => {},
};

export default storeController;