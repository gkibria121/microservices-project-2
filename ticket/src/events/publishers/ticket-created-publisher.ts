import { Publisher, Subject, TicketCreatedEvent } from "@_gktickets/common";

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
}
export default TicketCreatedPublisher;
