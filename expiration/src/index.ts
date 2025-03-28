import dontenv from "dotenv";
import { connectNatsStreaming } from "./utils/functions";
import { natsWrapper } from "./lib/natas-client";
dontenv.config();

try {
  connectNatsStreaming();
} catch (error) {
  console.error(error);
  process.exit();
}

natsWrapper.client.on("connect", () => {
  console.log("Nats connected!");
});
