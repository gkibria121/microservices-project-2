import connectDB from "./database/db";
import dontenv from "dotenv";
import { app } from "./utils/app";
import { connectNatsStreaming } from "./utils/functions";
dontenv.config();
if (!process.env.JWT_KEY) throw new Error("JWT_key not found!");
if (!process.env.MONGO_URL) throw new Error("MONGO_URL not found!");
try {
  connectDB();
} catch (error) {
  console.error(error);
  process.exit();
}

try {
  connectNatsStreaming();
} catch (error) {
  console.error(error);
  process.exit();
}

app.listen(3000, () => {
  console.log("Server listening on 3000!");
});
