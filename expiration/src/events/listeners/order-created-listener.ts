import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subject,
} from "@_gktickets/common";
import groupQueueName from "../group-name";
import { Message } from "node-nats-streaming";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  groupQueueName: string = groupQueueName;
  subject: Subject.OrderCreated = Subject.OrderCreated;
  onMessage(data: OrderCreatedEvent["data"], msg: Message): void {
    console.log("Message recieved: Order created!");
    msg.ack();
  }
}
