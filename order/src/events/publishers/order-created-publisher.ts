import { OrderCreatedEvent, Publisher, Subject } from "@_gktickets/common";

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
}
export default OrderCreatedPublisher;
