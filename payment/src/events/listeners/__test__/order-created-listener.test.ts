// setup

import {
  OrderCreatedEvent,
  OrderStatus,
  TicketCreatedEvent,
} from "@_gktickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../lib/natas-client";
import { OrderCreatedListener } from "../order-created-listener";
import Order from "../../../models/Order";
import { createOrder } from "../../../helpers/test_helpers";
const EXPIRATION_DURATION = 20 * 1000;
const setup = async (id: string = new mongoose.mongo.ObjectId().toString()) => {
  const data: OrderCreatedEvent["data"] = {
    id,
    expiresAt: new Date().getTime() + EXPIRATION_DURATION + "",
    status: OrderStatus.Created,
    ticket: {
      id: new mongoose.mongo.ObjectId().toString(),
      price: 100,
      title: "Ticket 1",
      userId: new mongoose.mongo.ObjectId().toString(),
      version: 0,
    },
    userId: new mongoose.mongo.ObjectId().toString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn().mockImplementation(() => {}),
    getSequence: jest
      .fn()
      .mockImplementation(() => Math.floor(Math.random() * 10)),
  };

  const listener = new OrderCreatedListener(natsWrapper.client);

  return { data, msg, listener };
};

it("Should create order", async () => {
  let orderLenth = (await Order.find()).length;
  expect(orderLenth).toBe(0);
  const { data, msg, listener } = await setup();
  await listener.onMessage(data, msg);
  orderLenth = (await Order.find()).length;
  expect(orderLenth).toBe(1);
});
it("Should return error if order is already there", async () => {
  const order = await createOrder();
  const { data, msg, listener } = await setup(order._id as string);

  try {
    await listener.onMessage(data, msg);
  } catch (error) {
    return;
  }
  throw new Error("Should test fail");
});
it("Should Ack message.", async () => {
  const { data, msg, listener } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
