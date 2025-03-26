import {
  Listener,
  NotAuthorized,
  OrderDeletedEvent,
  Subject,
} from "@_gktickets/common";
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
      version: data.ticket.version,
    });
    if (!ticket) throw new Error("Ticket not found!");

    if (ticket.orderId?.toString() !== data.id)
      throw new Error("Ticket is not reseverd for this order!");
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
