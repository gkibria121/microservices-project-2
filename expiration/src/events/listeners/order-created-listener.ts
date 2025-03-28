import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subject,
} from "@_gktickets/common";
import groupQueueName from "../group-name";
import { Message } from "node-nats-streaming";
import ExpirationCompletePublisher from "../publishers/expiration-complete-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  groupQueueName: string = groupQueueName;
  subject: Subject.OrderCreated = Subject.OrderCreated;
  onMessage(data: OrderCreatedEvent["data"], msg: Message): void {
    console.log("Message recieved: Order created!");
    new ExpirationCompletePublisher(this.client).publish({
      id: data.id,
    });
    msg.ack();
  }
}
