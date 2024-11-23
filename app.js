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

app.use((err, req, res, next) => {
    const status = err.statusCode || 404;
    res.status(status).render(`error/error${status}`, {
        statusCode: status,
        message: err.message,
        desc: err.desc
    });
});

app.listen(config.port, () => {
    console.log(`App is running on url http://localhost:${config.port}`);
});
