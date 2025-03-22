import { OrderCreatedEvent, Publisher, Subject } from "@_gktickets/common";

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
}
export default OrderCreatedPublisher;
