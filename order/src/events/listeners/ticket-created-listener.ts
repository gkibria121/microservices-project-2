import { TicketCreatedEvent, Listener, Subject } from "@_gktickets/common";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/Ticket";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
  groupQueueName: string = "ticket-created";
  async onMessage(
    data: { id: string; title: string; price: number },
    msg: Message
  ): Promise<void> {
    console.log(`Captured event ${msg.getSequence()} ${Subject.TicketCreated}`);

    try {
      const ticketAttr = { _id: data.id, title: data.title, price: data.price };
      await Ticket.create(ticketAttr);
      msg.ack();
    } catch (error) {}
  }
}
export default TicketCreatedListener;
