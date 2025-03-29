import dontenv from "dotenv";
import { connectNatsStreaming } from "./utils/functions";
import { natsWrapper } from "./lib/natas-client";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import Bull from "bull";
dontenv.config();

try {
  connectNatsStreaming();
} catch (error) {
  console.error(error);
  process.exit();
}

if (!process.env.REDIS_HOST) throw new Error("REDIS_HOST is not set!");

natsWrapper.client.on("connect", () => {
  console.log("Nats connected!");
  new OrderCreatedListener(natsWrapper.client).listen();
});
