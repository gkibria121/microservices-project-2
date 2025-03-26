import { Listener, OrderDeletedEvent, Subject } from "@_gktickets/common";
import { QueueGoupeName } from "../group-names";
import { Message } from "node-nats-streaming";

class OrderCancelledListener extends Listener<OrderDeletedEvent> {
  groupQueueName: string = QueueGoupeName.TicketQueueGroup;
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
  onMessage(data: OrderDeletedEvent["data"], msg: Message): void {
    console.log("order:cancelled/ticket-service");

    msg.ack();
  }
}

export default OrderCancelledListener;
