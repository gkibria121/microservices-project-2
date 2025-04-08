// setup

import { ExpirationCompleteEvent, OrderStatus } from "@_gktickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../lib/natas-client";
import ExpirationCompleteListener from "../expiration-complete-listener";
import { createOrder } from "../../../helpers/test_helpers";
import Order from "../../../models/Order";
const setup = async (id: string = new mongoose.mongo.ObjectId().toString()) => {
  const data: ExpirationCompleteEvent["data"] = {
    id,
    version: 1,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn().mockImplementation(() => {}),
    getSequence: jest
      .fn()
      .mockImplementation(() => Math.floor(Math.random() * 10)),
  };

  const listener = new ExpirationCompleteListener(natsWrapper.client);

  return { data, msg, listener };
};

it("Should return error if order not found!", async () => {
  const { data, msg, listener } = await setup();
  try {
    await listener.onMessage(data, msg);
  } catch (error) {
    return;
  }
  throw new Error("Should test fail");
});
it("Should not update order if order is completed.", async () => {
  const order = await createOrder({
    status: OrderStatus.Complete,
    userId: new mongoose.mongo.ObjectId(),
  });
  const { data, msg, listener } = await setup(order._id as string);
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findOne({ _id: order._id });
  expect(updatedOrder?.status).toBe(OrderStatus.Complete);
});
it("Should update order if order is not completed.", async () => {
  const order = await createOrder();
  const { data, msg, listener } = await setup(order._id as string);
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findOne({ _id: order._id });
  expect(updatedOrder?.status).toBe(OrderStatus.Cancelled);
});
it("Should Ack message.", async () => {
  const order = await createOrder();
  const { data, msg, listener } = await setup(order._id as string);
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
