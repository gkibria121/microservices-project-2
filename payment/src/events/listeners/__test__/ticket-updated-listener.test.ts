// setup

import { TicketUpdatedEvent } from "@_gktickets/common";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../../lib/natas-client";
import Ticket from "../../../models/Ticket";
import { createTicket } from "../../../helpers/test_helpers";
import TicketUpdatedListener from "../ticket-updated-listener";

const setup = async (): Promise<{
  data: TicketUpdatedEvent["data"];
  msg: Message;
  listener: TicketUpdatedListener;
}> => {
  const ticket = await createTicket();
  const data: TicketUpdatedEvent["data"] = {
    id: ticket._id as string,
    price: 10,
    title: "Updated Ticket",
    userId: ticket.userId,
    version: ticket.version + 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn().mockImplementation(() => {}),
    getSequence: jest
      .fn()
      .mockImplementation(() => Math.floor(Math.random() * 10)),
  };

  const listener = new TicketUpdatedListener(natsWrapper.client);

  return { data, msg, listener };
};

it("Should return error for mismatched   ticket version", async () => {
  const { data, msg, listener } = await setup();

  await listener.onMessage({ ...data, version: 10 }, msg);

  const ticket = await Ticket.findOne({});

  expect(ticket!.title).not.toBe(data.title);
});
it("Should update  ticket", async () => {
  const { data, msg, listener } = await setup();
  let ticket = await Ticket.findOne({});
  await listener.onMessage(data, msg);
  let updatedTicket = await Ticket.findOne({});
  expect(updatedTicket!.title).not.toBe(ticket!.title);
});
