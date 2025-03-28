import { Listener, OrderCreatedEvent, Subject } from "@_gktickets/common";
import groupQueueName from "../group-name";
import { Message } from "node-nats-streaming";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  groupQueueName: string = groupQueueName;
  subject: Subject.OrderCreated = Subject.OrderCreated;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    console.log("Message received: Order created!");
    msg.ack();
  }
}
