import db from '../config/db.js';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const productData = {
    all: async () => {  
        const querySnapshot = await getDocs(collection(db, 'product'));
        const products = querySnapshot.docs.map(doc => doc.data());
        return products;
    },
    one: async (id) => {
        const { data } = await module.exports.all();
        return data.find(product => product.id === id);
    },
    search: async (query) => {
        const { data } = await productData.all();
        return data.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()));
    },
    searchCategory: async (query) => {
        const { data } = await productData.all();
        return data.filter(product => product.category.toLowerCase().includes(query.toLowerCase()));
    },
    //filterData(data, 'price', 12000, 100000)
    //filterData(data, 'star', 4, 5)
    filterData: async (data, criteria, from = 0, to = Infinity) => {
        return data.filter(product => product[criteria] >= from && product[criteria] <= to);
    },
    // in case using pagination
    paginate: (data, page, perPage) => {
        const total_pages = Math.ceil(data.length / perPage);
        const start = (page - 1) * perPage;
        const end = start + perPage;
        
        return {
            data: data.slice(start, end),
            current_page: page,
            total_pages: total_pages,
        };
    },
};

export default productData;