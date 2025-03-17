import { Publisher, Subject, TicketDeletedEvent } from "@_gktickets/common";

class TicketDeletedPublisher extends Publisher<TicketDeletedEvent> {
  subject: Subject.TicketDeleted = Subject.TicketDeleted;
}
export default TicketDeletedPublisher;
