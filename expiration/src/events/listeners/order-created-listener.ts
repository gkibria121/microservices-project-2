import { Listener, OrderCreatedEvent, Subject } from "@_gktickets/common";
import groupQueueName from "../group-name";
import { Message } from "node-nats-streaming";
import Bull from "bull";

// Create a queue for logging messages
const logQueue = new Bull("logQueue", {
  redis: { host: "redis-srv", port: 6379 },
});

// Process the queue: Log the message after the delay
logQueue.process(async (job) => {
  console.log(`Processing Job: ${job.data.message}`);
});

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  groupQueueName: string = groupQueueName;
  subject: Subject.OrderCreated = Subject.OrderCreated;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    console.log("Message received: Order created!");
    msg.ack();
    // Add a job to log something after 5 seconds
    logQueue.add(
      { message: `Order ${data.id} processed after delay` },
      { delay: 500 }
    );
  }
}
