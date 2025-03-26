import { Listener, OrderCreatedEvent, Subject } from "@_gktickets/common";
import { QueueGoupeName } from "../group-names";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/Ticket";
import TicketUpdatedPublisher from "../publishers/ticket-updated-publisher";

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  groupQueueName: string = QueueGoupeName.TicketQueueGroup;
  subject: Subject.OrderCreated = Subject.OrderCreated;
  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    console.log("order:created/ticket-service");

    const ticket = await Ticket.findOne({
      _id: data.ticket.id,
      version: data.ticket.version,
    });

    if (!ticket) throw new Error("Ticket not found!");
    ticket.orderId = data.id;
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

export default OrderCreatedListener;
