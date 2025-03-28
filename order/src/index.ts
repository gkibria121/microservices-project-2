import connectDB from "./database/db";
import dontenv from "dotenv";
import { app } from "./utils/app";
import { connectNatsStreaming } from "./utils/functions";
import { natsWrapper } from "./lib/natas-client";
import TicketUpdatedListener from "./events/listeners/ticket-updated-listener";
import TicketCreatedListener from "./events/listeners/ticket-created-listener";
import ExpirationCompleteListener from "./events/listeners/expiration-complete-listener";
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
  console.log("connected");
  new TicketCreatedListener(natsWrapper.client).listen();
  new TicketUpdatedListener(natsWrapper.client).listen();
  new ExpirationCompleteListener(natsWrapper.client).listen();
});

app.listen(3000, () => {
  console.log("Server listening on 3000!");
});
