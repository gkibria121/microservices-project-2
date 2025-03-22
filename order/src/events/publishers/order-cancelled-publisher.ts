import { OrderDeletedEvent, Publisher, Subject } from "@_gktickets/common";

class OrderCancelledPublisher extends Publisher<OrderDeletedEvent> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
}
export default OrderCancelledPublisher;
