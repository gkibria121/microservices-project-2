import { Listener, Subject, TicketUpdatedEvent } from "@_gktickets/common";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/Ticket";

class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
  groupQueueName: string = "ticket-updated";
  async onMessage(
    data: { id: string; title: string; price: number },
    msg: Message
  ): Promise<void> {
    console.log(`Captured event ${msg.getSequence()} ${Subject.TicketUpdated}`);
    try {
      const ticketAttr = { _id: data.id, title: data.title, price: data.price };
      await Ticket.updateOne({ _id: data.id }, ticketAttr);
      msg.ack();
    } catch (e) {
      console.log(e);
    }
  }
}
export default TicketUpdatedListener;
