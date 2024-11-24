import db from '../config/db.js';
import { collection, doc, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

const productData = {
    all: async () => {
        const querySnapshot = await getDocs(collection(db, 'product'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    one: async (id) => {
        const productRef = doc(db, 'product', id);
        const docSnap = await getDoc(productRef);
        return docSnap;
    },

    search: async (queryStr, field = 'all') => {
        const productRef = collection(db, 'product');
        let q;

        if (field === 'category') {
            q = query(productRef, where('category', '>=', queryStr), where('category', '<=', queryStr + '\uf8ff'));
        } else if (field === 'name') {
            q = query(productRef, where('name', '>=', queryStr), where('name', '<=', queryStr + '\uf8ff'));
        } else {
            const querySnapshot = await getDocs(productRef);
            const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return products.filter(product =>
                product.name.toLowerCase().includes(queryStr.toLowerCase()) ||
                product.category.toLowerCase().includes(queryStr.toLowerCase())
            );
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    searchAndFilter: async (queryStr = '', field = 'all', filters = []) => {
        let results = await productData.search(queryStr, field);

        results = filters.reduce((filteredData, { field, from, to }) => {
            return filteredData.filter(item =>
                (from === undefined || item[field] >= from) &&
                (to === undefined || item[field] <= to)
            );
        }, results);

        return results;
    },

    add: async (product) => {
        try {
            const productRef = doc(collection(db, 'product'), product.product_id);
            await setDoc(userRef, product);
            
            return { status: true, id: productRef.id };
        } catch (e) {
            console.error("Error adding document: ", e);
            return { status: false, error: e.message };
        }
    },

    update: async (id, newUpdate) => {
        const productRef = doc(db, 'product', id);
        await updateDoc(productRef, newUpdate);
        return { status: true };
    },

    delete: async (id) => {
        const productRef = doc(db, 'product', id);
        await deleteDoc(productRef);
        return { status: true };
    },

    //for pagination, alter later
    paginate: (data, page, perPage) => {
        const total_pages = Math.ceil(data.length / perPage);
        const start = (page - 1) * perPage;
        return {
            data: data.slice(start, start + perPage),
            current_page: page,
            total_pages,
            total_items: data.length,
        };
    },
};

export default productData;
