import { Publisher, Subject, TicketUpdatedEvent } from "@_gktickets/common";

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
}
export default TicketUpdatedPublisher;
