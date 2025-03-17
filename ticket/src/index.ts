import connectDB from "./database/db";
import dontenv from "dotenv";
import { app } from "./utils/app";
dontenv.config();

try {
  connectDB();
} catch (error) {
  console.error(error);
  process.exit();
}
if (!process.env.JWT_KEY) throw new Error("JWT key not found!");
if (!process.env.MONGO_URL) throw new Error("Please provide mongo url");
app.listen(3000, () => {
  console.log("Server listening on 3000!");
});
