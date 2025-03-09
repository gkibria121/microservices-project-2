import express from "express";
import { json } from "express";
import { apiRouter } from "./routes/api";
import cookieSession from "cookie-session";
import connectDB from "./database/db";
import dontenv from "dotenv";

dontenv.config();
const app = express();

try {
  connectDB();
} catch (error) {
  console.error(error);
  process.exit();
}

app.use(json());
app.set("trust proxy", 1);
app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 1000,
    signed: false,
  })
);
app.use(apiRouter);
app.all("*", (req, res) => {
  res.status(404).json({ message: "Api endpoint not found!" });
});
app.listen(3000, () => {
  console.log("Server listening on 3000!");
});
