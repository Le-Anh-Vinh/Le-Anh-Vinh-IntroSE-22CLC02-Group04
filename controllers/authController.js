import productData from '../models/products.js';
import MyError from '../cerror.js';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import auth from '../config/auth.js';
import admin from '../config/admin.js';


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

    signup: async (req, res, next) => {
        try {
            const formInput = req.body; // {email: "", password: "", name = ""}

            const userRecord = await admin.auth().createUser({
                email: formInput.email,
                password: formInput.password,
                displayName: formInput.name
            });

            

            await admin.auth().setCustomUserClaims(userRecord.uid, { role: formInput.role });

        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    },

    login: async (req, res, next) => {
        try {
            const formInput = req.body; // {email: "", password: ""}

            const userCredential = await signInWithEmailAndPassword(auth, formInput.email, formInput.password)
            const user = userCredential.user;
            const idToken = await user.getIdToken(); 
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const role = decodedToken.role;
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
 
    changeUserInfo: async (req, res, next) => {
        
    },
};

export default authController;