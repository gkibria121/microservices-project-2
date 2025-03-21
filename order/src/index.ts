import connectDB from "./database/db";
import dontenv from "dotenv";
import { app } from "./utils/app";
import { connectNatsStreaming } from "./utils/functions";
dontenv.config();
if (!process.env.JWT_KEY) throw new Error("JWT_key not found!");
if (!process.env.MONGO_URL) throw new Error("MONGO_URL not found!");
if (!process.env.CLUSTER_ID) throw new Error("CLUSTER_ID not found!");
if (!process.env.NATS_URL) throw new Error("NATS_URL not found!");
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
