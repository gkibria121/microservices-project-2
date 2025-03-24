import { TicketCreatedEvent, Listener, Subject } from "@_gktickets/common";
import { Message } from "node-nats-streaming";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
  groupQueueName: string = "ticket-created";
  onMessage(
    data: { id: string; title: string; price: number },
    msg: Message
  ): void {
    console.log(`Captured event ${msg.getSequence()} ${Subject.TicketCreated}`);
    msg.ack();
  }
}
export default TicketCreatedListener;
