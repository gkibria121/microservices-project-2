import dontenv from "dotenv";
import { connectNatsStreaming } from "./utils/functions";
import { natsWrapper } from "./lib/natas-client";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import bull from "./lib/bull";
dontenv.config();

try {
  connectNatsStreaming();
} catch (error) {
  console.error(error);
  process.exit();
}

if (!process.env.REDIS_HOST) throw new Error("Redis host is required!");

if (!process.env.REDIS_PORT) throw new Error("Redis port is required");
natsWrapper.client.on("connect", () => {
  console.log("Nats connected!");
  new OrderCreatedListener(natsWrapper.client).listen();
});
