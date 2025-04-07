// setup

import { ExpirationCompleteEvent } from "@_gktickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../lib/natas-client";
import ExpirationCompleteListener from "../expiration-complete-listener";
const setup = async () => {
  const data: ExpirationCompleteEvent["data"] = {
    id: new mongoose.mongo.ObjectId().toString(),
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

it.todo("Should return error if order not found!");
it.todo("Should not update order if order is completed.");
it.todo("Should update order if order is not completed.");
it.todo("Should Ack message.");
