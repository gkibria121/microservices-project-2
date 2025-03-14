import request from "supertest";
import { app } from "../utils/app";
import { sign } from "jsonwebtoken";
import Ticket from "../models/Ticket";
import mongoose from "mongoose";

export function testLogin(
  credentials = {
    email: "gkibria121@gmail.com",
    id: "randomId",
  }
) {
  const jwt = sign(credentials, process.env.JWT_KEY!);

  const cookie = {
    jwt,
  };

  const cookieBase64 = Buffer.from(JSON.stringify(cookie)).toString("base64");

  return [`session=${cookieBase64}`];
}

export async function createTicket(
  userId: string | any = new mongoose.mongo.ObjectId()
) {
  const ticket = {
    title: "some title",
    price: 100,
    userId: userId,
  };
  return await Ticket.create({
    ...ticket,
  });
}
