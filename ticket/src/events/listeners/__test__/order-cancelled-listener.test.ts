import { OrderDeletedEvent } from "@_gktickets/common";
import { natsWrapper } from "../../../lib/natas-client";
import Ticket, { TicketDoc } from "../../../models/Ticket";
import OrderCancelledListener from "../order-cancelled-listener";
import mongoose from "mongoose";
import { createTicket } from "../../../helpers/test_helpers";

const setup = async (ticket?: TicketDoc) => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const data: OrderDeletedEvent["data"] = {
    id: new mongoose.mongo.ObjectId().toHexString(),
    ticket: {
      id:
        (ticket?._id as string) ?? new mongoose.mongo.ObjectId().toHexString(),
      version: ticket?.version as number,
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
it("Should return error for different orderId", async () => {
  const ticket = await createTicket();
  const { listener, data, msg } = await setup(ticket);
  try {
    await listener.onMessage(data, msg);
  } catch (e) {
    return;
  }
  throw new Error("Should not reach here!");
});
it("Should remove orderId attribute", async () => {
  const ticket = await createTicket();

  const { listener, data, msg } = await setup(ticket);
  ticket.set("orderId", data.id);
  await ticket.save();
  await listener.onMessage(
    { ...data, ticket: { ...data.ticket, version: ticket.version } },
    msg
  );
  const updatedTicket = await Ticket.findById(ticket._id);
  expect(updatedTicket?.orderId).not.toBeDefined();
});
it("Should publish ticket updated event", async () => {
  const ticket = await createTicket();

  const { listener, data, msg } = await setup(ticket);
  ticket.set("orderId", data.id);
  await ticket.save();
  await listener.onMessage(
    { ...data, ticket: { ...data.ticket, version: ticket.version } },
    msg
  );
  const publishedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(publishedData.id).toBe(ticket._id?.toString());
  expect(publishedData.version).toBe(ticket.version + 1);
});
it("Should ack msg", async () => {
  const ticket = await createTicket();

  const { listener, data, msg } = await setup(ticket);
  ticket.set("orderId", data.id);
  await ticket.save();
  await listener.onMessage(
    { ...data, ticket: { ...data.ticket, version: ticket.version } },
    msg
  );
  expect(msg.ack).toHaveBeenCalled();
});
