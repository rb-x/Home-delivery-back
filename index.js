import express from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import auth from "./routes/auth";
import annonces from "./routes/annonces";
 
import db from "./config/db";
const app = express();
const port = process.env.PORT || 8080;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/annonce", annonces);
app.use("/auth", auth);

app.get("/", (req, res) => {
  
  res.send("html");
});

app.listen(port, () => console.log(`Listening on port ${port}  .🚀...`));

export default app;
