import { PaymentCreatedEvent, Publisher, Subject } from "@_gktickets/common";

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subject.PaymentCreated = Subject.PaymentCreated;
}
export default PaymentCreatedPublisher;
