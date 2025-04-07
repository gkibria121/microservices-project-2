import request from "supertest";
import { app } from "../utils/app";
import { sign } from "jsonwebtoken";
import mongoose from "mongoose";
import Order from "../models/Order";
import { OrderStatus } from "@_gktickets/common";

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

export async function createOrder(
  userId: string | any = new mongoose.mongo.ObjectId()
) {
  return await Order.create({
    userId,
    status: OrderStatus.Created,
    expiresAt: new Date().toString(),
  });
}
