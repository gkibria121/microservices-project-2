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
const EXPIRATION_DURATION = 20 * 1000;
const setup = async () => {
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.mongo.ObjectId().toString(),
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

it.todo("Should create order");
it.todo("Should return error if order is already there");
it.todo("Should Ack message.");
