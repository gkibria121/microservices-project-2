import { Listener, OrderDeletedEvent, Subject } from "@_gktickets/common";
import { QueueGoupeName } from "../group-names";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/Ticket";
import TicketUpdatedPublisher from "../publishers/ticket-updated-publisher";

class OrderCancelledListener extends Listener<OrderDeletedEvent> {
  groupQueueName: string = QueueGoupeName.TicketQueueGroup;
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
  async onMessage(
    data: OrderDeletedEvent["data"],
    msg: Message
  ): Promise<void> {
    console.log("order:cancelled/ticket-service");
    const ticket = await Ticket.findOne({
      _id: data.ticket.id,
      orderId: data.id,
    });
    if (!ticket) throw new Error("Ticket not found!");
    ticket.orderId = undefined;
    await ticket.save();
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    msg.ack();
  }
}

export default OrderCancelledListener;
