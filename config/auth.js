import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import config from "./config.js";

const firebaseApp = firebase.initializeApp(config.firebaseConfig);
const auth = getAuth(firebaseApp);

export default auth;