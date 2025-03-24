import { TicketCreatedEvent, Listener, Subject } from "@_gktickets/common";
import { Message } from "node-nats-streaming";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  protected ackWait: number = 5 * 100;
  subject: Subject.TicketCreated = Subject.TicketCreated;
  groupQueueName: string = "ticket-created";
  onMessage(
    data: { id: string; title: string; price: number },
    msg: Message
  ): void {
    console.log("Ticket created!");
    msg.ack();
  }
}
export default TicketCreatedListener;
