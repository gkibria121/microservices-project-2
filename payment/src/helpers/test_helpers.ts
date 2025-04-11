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
  options?: Partial<{
    userId: mongoose.Types.ObjectId;
    status: OrderStatus;
    price: number;
  }>
) {
  const defaultOptions = {
    userId: new mongoose.Types.ObjectId(),
    status: OrderStatus.Created,
    price: 100,
  };

  const finalOptions = { ...defaultOptions, ...options };

  return await Order.create(finalOptions);
}
