import { Listener, OrderCreatedEvent, Subject } from "@_gktickets/common";
import groupQueueName from "../group-name";
import { Message } from "node-nats-streaming";
import experationCompleteQueue from "../../lib/bull";

const getRemainingTime = (expiresAt: Date, currentTime: Date) => {
  const startTime = currentTime.getTime();
  const endTime = expiresAt.getTime();
  return endTime - startTime;
};

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  groupQueueName: string = groupQueueName;
  subject: Subject.OrderCreated = Subject.OrderCreated;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    console.log("Message received: Order created!");
    const currentTime = new Date();
    const expiresAt = new Date(data.expiresAt);
    const delay = getRemainingTime(expiresAt, currentTime);
    experationCompleteQueue.add({ orderId: data.id }, { delay });
    msg.ack();
  }
}
