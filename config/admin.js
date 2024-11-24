import admin from 'firebase-admin';
import config from "./config.js";

admin.initializeApp({
  credential: admin.credential.cert(config.firebaseConfig),
  databaseURL: 'https://<your-database-name>.firebaseio.com'
});

export default admin;
 