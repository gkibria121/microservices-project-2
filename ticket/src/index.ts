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

app.listen(3000, () => {
  if (!process.env.JWT_KEY) throw new Error("JWT key not found!");
  console.log("Server listening on 3000!");
});
