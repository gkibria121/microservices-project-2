import dontenv from "dotenv";
import { connectNatsStreaming } from "./utils/functions";
import { natsWrapper } from "./lib/natas-client";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
dontenv.config();

try {
  connectNatsStreaming();
} catch (error) {
  console.error(error);
  process.exit();
}

natsWrapper.client.on("connect", () => {
  console.log("Nats connected!");
  new OrderCreatedListener(natsWrapper.client).listen();
});
