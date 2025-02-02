import userData from '../models/users.js';
import cartData from '../models/carts.js';
import MyError from '../cerror.js';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import auth from '../config/auth.js';
import admin from '../config/admin.js';
import { Timestamp } from 'firebase/firestore';

async function createUserStorage (uid, displayName, email, role) {
    try {
        let newUser;
        if (role === 'user'){
            newUser = {
                uid: uid,
                username: displayName,
                name: '',
                email: email,
                gender: 'male',
                info: [],
                role: role
            };
            await cartData.new(uid);
        } else {
            const date = new Date();
            newUser = {
                store_id: uid,
                name: displayName,
                email: email,
                info: [],
                rate: 0,
                join_date: Timestamp.fromDate(date),
                role: role
            };
        }

        const result = await userData.new(uid, newUser);
        console.log('User created:', result);
        return true;
    } catch (error) {
        console.error('Error creating user storage:', error);
        return false;          
    }
}


const authController = {
    getAuthentication: (req, res, next) => {
        try {

            res.render('authentication');
        } catch (error) {
            next(new MyError(404, "Can't found log in page"));
        }
    },

    getForgetPassword: (req, res, next) => {
        try {
            res.render('forgotPass');
        } catch (error) {
            next(new MyError(404, "Can't found log in page"));
        }
    },

    getInputInfo: async(req, res, next) => {
        try {
            const uid = req.query.uid;
            const user = await userData.get(uid);
            const role = user.role;
            if (role === "user") {
                res.render('getUserInfo', {uid});
            }
            else {
                res.render('getStoreInfo', {uid});
            }   
        } catch (error) {
            next(new MyError(404, "Can't found log in page"));
        }
    },

    signup: async (req, res, next) => {
        try {
            const formInput = req.body; // {email: "", password: "", name = ""}

            const userRecord = await admin.auth().createUser({
                email: formInput.email,
                password: formInput.password,
                displayName: formInput.name
            });

            const s = await createUserStorage(userRecord.uid, formInput.name, formInput.email, formInput.role);

            if(!s) {
                return res.status(500).send("something wrong with creating account");
            }

            if(formInput.role === 'user') {
                res.json({ success: true, redirectURL: '/complete_signup?uid='+ encodeURIComponent(userRecord.uid) });
            } else {
                res.json({ success: true, redirectURL: '/complete_signup?uid='+ encodeURIComponent(userRecord.uid) });
            }

        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    login: async (req, res, next) => {
        try {
            const formInput = req.body; // {email: "", password: ""}
    
            const userCredential = await signInWithEmailAndPassword(auth, formInput.email, formInput.password);
            const user = userCredential.user;
            const userInf = await userData.get(user.uid);
            const role = userInf.role;
    
            res.json({ success: true, user: user, role: role });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    
    changePassword: async (req, res, next) => {
        try {
            const { uid, newpass } = req.body;
            await admin.auth().updateUser(uid, { password: newpass });
    
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    resetPassword: async (req, res, next) => {
        try {
            const { email } = req.body;
            console.log(email);
            await sendPasswordResetEmail(auth, email);
            res.json({status: true});
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    logout: (req, res, next) => {
        try {
            res.redirect('/auth');
        } catch (error) {
            next(new MyError(error.status, error.message));
        }
    }
};

export default authController;