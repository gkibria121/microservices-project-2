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
  console.log("Server listening on 3000!");
});
