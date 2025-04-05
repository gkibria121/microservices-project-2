import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subject,
} from "@_gktickets/common";
import { Message } from "node-nats-streaming";
import groupQueueName from "../group-name";
import OrderModel from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  groupQueueName: string = groupQueueName;
  subject: Subject.OrderCreated = Subject.OrderCreated;
  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    await OrderModel.create({
      _id: data.id,
      userId: data.userId,
      price: data.ticket.price,
    });

    msg.ack();
  }
}
