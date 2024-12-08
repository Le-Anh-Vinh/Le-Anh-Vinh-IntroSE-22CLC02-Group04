import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./config/config.js";
import router from "./routes/router.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("./public"));

app.use('/', router);

app.use((req, res, next) => {
    const err = new Error("Page Not Found");
    err.statusCode = 404;
    err.desc = "The page you are looking for does not exist.";
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).render(`error/error${status}`, {
        statusCode: status,
        message: err.message,
        desc: err.desc
    });
});

app.listen(config.port, () => {
    console.log(`App is running on url http://localhost:${config.port}/auth`);
});