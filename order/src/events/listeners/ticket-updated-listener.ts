import { Listener, Subject, TicketUpdatedEvent } from "@_gktickets/common";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/Ticket";

class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
  groupQueueName: string = "ticket-updated";
  async onMessage(
    data: TicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    console.log(`Captured event ${msg.getSequence()} ${Subject.TicketUpdated}`);
    try {
      const ticketAttr = {
        _id: data.id,
        title: data.title,
        price: data.price,
        version: data.version,
      };
      const ticket = await Ticket.findOne({
        _id: data.id,
        version: data.version - 1,
      });

      if (!ticket) throw new Error("Ticket not found!");

      ticket.title = ticketAttr.title;
      ticket.price = ticketAttr.price;
      await ticket.save();
      msg.ack();
    } catch (e) {
      console.log(e);
    }
  }
}
export default TicketUpdatedListener;
