import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRouter from "./routes/auth";
import annoncesRouter from "./routes/annonces";
import bodylogger from "./middlewares/bodylogger"
import db from "../config/db";
const app = express();


app.use(helmet());
process.env.ENV === "TEST" && app.use(bodylogger)
app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use("/annonce", annoncesRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    const someval = 1

    res.send("html");
});

module.exports = app


