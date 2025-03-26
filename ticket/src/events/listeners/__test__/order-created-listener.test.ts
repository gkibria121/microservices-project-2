import { OrderCreatedEvent, OrderStatus } from "@_gktickets/common";
import { natsWrapper } from "../../../lib/natas-client";
import OrderCreatedListener from "../order-created-listener";
import mongoose, { mongo } from "mongoose";
import { Message } from "node-nats-streaming";
import { createTicket } from "../../../helpers/test_helpers";
import Ticket, { TicketDoc } from "../../../models/Ticket";

const setup = async (ticket?: TicketDoc) => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.mongo.ObjectId().toHexString(),
    expiresAt: "",
    userId: new mongoose.mongo.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      id:
        (ticket?._id as string) ?? new mongoose.mongo.ObjectId().toHexString(),
      price: 10,
      title: "Invalid Ticket",
      userId: new mongoose.mongo.ObjectId().toHexString(),
      version: (ticket?.version as number) ?? 0,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it("Should throw error if ticket not found", async () => {
  const { listener, data, msg } = await setup();
  try {
    await listener.onMessage(data, msg);
  } catch (e) {
    return;
  }
  throw new Error("Ticket should not be found!");
});

it("Should add orderId attribute", async () => {
  const ticket = await createTicket();

  const { listener, data, msg } = await setup(ticket);
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket._id);
  expect(updatedTicket?.orderId?.toString()).toBe(data.id);
});
it("Should publish ticket updated event with updated version", async () => {
  const ticket = await createTicket();
  const { listener, data, msg } = await setup(ticket);
  await listener.onMessage(data, msg);

  const publishedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(publishedData.id).toBe(ticket._id?.toString());
  expect(publishedData.version).toBe(ticket.version + 1);
});
it("Should ack msg", async () => {
  const ticket = await createTicket();
  const { listener, data, msg } = await setup(ticket);
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
