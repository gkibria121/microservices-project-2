import connectDB from "./database/db";
import dontenv from "dotenv";
import { app } from "./utils/app";
import { connectNatsStreaming } from "./utils/functions";
import { natsWrapper } from "./lib/natas-client";
import OrderCreatedListener from "./events/listeners/order-created-listener";
import OrderCancelledListener from "./events/listeners/order-cancelled-listener";
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

natsWrapper.client.on("connect", () => {
  new OrderCreatedListener(natsWrapper.client).listen();
  new OrderCancelledListener(natsWrapper.client).listen();
});
app.listen(3000, () => {
  console.log("Server listening on 3000!");
});
