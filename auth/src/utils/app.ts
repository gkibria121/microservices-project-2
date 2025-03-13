import express from "express";
import { json } from "express";
import { apiRouter } from "../routes/api";
import cookieSession from "cookie-session";
import {
  ExceptionHandlerMiddleware,
  NotFoundException,
} from "@_gktickets/common";

const app = express();

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

app.use(ExceptionHandlerMiddleware);

export { app };
