import {
  ExpirationCompleteEvent,
  Listener,
  Publisher,
  Subject,
} from "@_gktickets/common";

export default class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
}
