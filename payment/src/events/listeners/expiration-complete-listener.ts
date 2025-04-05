import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subject,
} from "@_gktickets/common";
import { Message } from "node-nats-streaming";
import groupQueueName from "../group-name";
import OrderModel from "../../models/order";

class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
  groupQueueName: string = groupQueueName;
  async onMessage(
    data: { id: string; version: number },
    msg: Message
  ): Promise<void> {
    console.log(`Message received: ${Subject.ExpirationComplete}`);
    const order = await OrderModel.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) throw new Error("Order not found #" + data.id);
    if (order.status !== OrderStatus.Complete) {
      order.status = OrderStatus.Cancelled;
      await order.save();
    }

    msg.ack();
  }
}
export default ExpirationCompleteListener;
