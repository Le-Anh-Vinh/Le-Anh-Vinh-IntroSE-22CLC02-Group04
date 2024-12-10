import productData from '../models/products.js';
import reportData from '../models/reports.js';
import MyError from '../cerror.js';

const adminController = {
    getReport: async (req, res, next) => {
        try {
            const id = req.params.id;
            const report = await reportData.get(id);
            res.render('report', { report: report });
        } catch (error) {
            next(new MyError(error.status, error.message));
        }
    },

    reviewReport: async (req, res, next) => {
        try {
            const { id, action } = req.body;
            await reportData.update(id, action ? "accepted" : "declined");
            res.json({ status: true });
        } catch (error) {
            next(new MyError(error.status, error.message));
        }
    }
};

export default adminController;