import dotenv from "dotenv";
import assert from "assert";
import { type } from "os";

dotenv.config();

const {
    PORT,
    HOST,
    HOST_URL,
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
    PRIVATE_KEY,
    CLIENT_EMAIL
} = process.env;

assert(PORT, "PORT is required");
assert(HOST, "HOST is required");

const config = {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    firebaseConfig:{
        type: "service_account",
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
        storageBucket: STORAGE_BUCKET,
        messagingSenderId: MESSAGING_SENDER_ID,
        appId: APP_ID,
        privateKey: PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: CLIENT_EMAIL,
    }
}

export default config;