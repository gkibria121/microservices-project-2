import { Listener, OrderCreatedEvent, Subject } from "@_gktickets/common";
import { QueueGoupeName } from "../group-names";
import { Message } from "node-nats-streaming";

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  groupQueueName: string = QueueGoupeName.TicketQueueGroup;
  subject: Subject.OrderCreated = Subject.OrderCreated;
  onMessage(data: OrderCreatedEvent["data"], msg: Message): void {
    console.log("order:created/ticket-service");
    msg.ack();
  }
}

export default OrderCreatedListener;
