import db from '../config/db.js';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import MyError from '../cerror.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import auth from '../config/auth.js';
import admin from '../config/admin.js';


const authController = {
    getAll: async (req, res, next) => {
        try {
            res.render('home');
        } catch (error) {
            next(new MyError(404, "Can't found Home page"));
        }
    },

    getAuthentication: (req, res, next) => {
        try {
            res.render('authentication');
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

            await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'user' });

        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    login: async (req, res, next) => {
        try {
            const formInput = req.body; // {email: "", password: ""}

            const userCredential = await signInWithEmailAndPassword(auth, formInput.email, formInput.password)
            if (userCredential) {
                const user = userCredential.user;
                const idToken = await user.getIdToken(); 
                const decodedToken = await admin.auth().verifyIdToken(idToken);
                const role = decodedToken.role;
                res.json({ success: true, user: user, role: role });
            }
            else {
                next(new MyError(401, "Invalid login request"));
            }
        } catch (error) {
            res.json({ success: false, error: error });
            next(new MyError(500, "There was something wrong with login"));
        }
    }
};

export default authController;