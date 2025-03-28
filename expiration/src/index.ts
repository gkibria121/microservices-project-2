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

natsWrapper.client.on("connect", () => {
  console.log("Nats connected!");
  new OrderCreatedListener(natsWrapper.client).listen();
});

const testQueue = new Bull("test-queue", "redis://redis-srv:6379");

testQueue.process((job, done) => {
  console.log("processing job ", job.data);
  done();
});
console.log("add to queue");

testQueue.add({ message: "should be done" }, { delay: 100 });
