import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./config/config.js";
import authRouter from "./routes/authRouter.js"

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./public"));

app.use('/', authRouter);

app.listen(config.port, () => { console.log(`App is running on url http://localhost:8080`)});