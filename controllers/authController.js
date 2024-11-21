import db from '../config/db.js';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import MyError from '../cerror.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import auth from '../firebase.js';

const authController = {
    getAll: async (req, res, next) => {
        try {
            res.render('home');
        } catch (error) {
            next(new MyError(404, "Can't found Home page"));
        }
    },

    getLogin: (req, res, next) => {
        try {
            res.render('login', { title: 'Login' });
        } catch (error) {
            next(new MyError(404, "Can't found log in page"));
        }
    },

    getSignup: (req, res, next) => {
        try {
            res.render('signup', { title: 'Signup' });
        } catch (error) {
            next(new MyError(404, "Can't found sign up page"));
        }
    },

    signup: (req, res, next) => {
        try {
            const formInput = req.body; // {email: "", password: ""}

            createUserWithEmailAndPassword(auth, formInput.email, formInput.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("User signed up:", user);
                    res.status(200).send("User signed up successfully");
                })
                .catch((error) => {
                    console.error("Error signing up:", error);
                    next(new MyError(401, "Invalid signup request"));
                });
        } catch (error) {
            console.error("Error in signup:", error);
            next(new MyError(500, "There was something wrong with signup"));
        }
    },

    login: (req, res, next) => {
        try {
            const formInput = req.body; // {email: "", password: ""}

            signInWithEmailAndPassword(auth, formInput.email, formInput.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("User signed in:", user);
                    res.status(200).send("User signed in successfully");
                })
                .catch((error) => {
                    console.error("Error signing in:", error);
                    next(new MyError(401, "Invalid login request"));
                });
        } catch (error) {
            console.error("Error in login:", error);
            next(new MyError(500, "There was something wrong with login"));
        }
    }
};

export default authController;