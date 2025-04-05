// setup

import { TicketCreatedEvent } from "@_gktickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import TicketCreatedListener from "../ticket-created-listener";
import { natsWrapper } from "../../../../lib/natas-client";
import Ticket from "../../../models/Ticket";

const setup = async (): Promise<{
  data: TicketCreatedEvent["data"];
  msg: Message;
  listener: TicketCreatedListener;
}> => {
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.mongo.ObjectId().toString(),
    price: 100,
    title: "Ticket 1",
    userId: new mongoose.mongo.ObjectId().toString(),
    version: 0,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn().mockImplementation(() => {}),
    getSequence: jest
      .fn()
      .mockImplementation(() => Math.floor(Math.random() * 10)),
  };

  const listener = new TicketCreatedListener(natsWrapper.client);

  return { data, msg, listener };
};

it("Should create and save ticket", async () => {
  const { data, msg, listener } = await setup();

  let tickets = (await Ticket.find({})).length;
  expect(tickets).toBe(0);
  await listener.onMessage(data, msg);
  tickets = (await Ticket.find({})).length;
  expect(tickets).toBe(1);
});

it("Should call ack ", async () => {
  const { data, msg, listener } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalledTimes(1);
});
