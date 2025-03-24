import { Listener, Subject, TicketUpdatedEvent } from "@_gktickets/common";
import { Message } from "node-nats-streaming";

class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
  groupQueueName: string = "ticket-updated";
  onMessage(
    data: { id: string; title: string; price: number },
    msg: Message
  ): void {
    console.log("Ticket updated!");
    msg.ack();
  }
}
export default TicketUpdatedListener;
