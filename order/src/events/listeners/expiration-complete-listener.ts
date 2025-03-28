import { ExpirationCompleteEvent, Listener, Subject } from "@_gktickets/common";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/Ticket";
import groupQueueName from "../group-name";

class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
  groupQueueName: string = groupQueueName;
  async onMessage(data: { id: string }, msg: Message): Promise<void> {
    console.log(`Message received: ${Subject.ExpirationComplete}`);

    msg.ack();
  }
}
export default ExpirationCompleteListener;
