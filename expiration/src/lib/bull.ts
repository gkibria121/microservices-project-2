import Bull from "bull";
import groupQueueName from "../events/group-name";
import ExpirationCompletePublisher from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "./natas-client";
const experationCompleteQueue = new Bull(
  groupQueueName,
  process.env.REDIS_HOST!
);

experationCompleteQueue.process((job, done) => {
  console.log("processing job ", job.data);
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    id: job.data.orderId,
    version: job.data.version,
  });
  done();
});
export default experationCompleteQueue;
