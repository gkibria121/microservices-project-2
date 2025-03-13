import request from "supertest";
import { app } from "../utils/app";
import { sign } from "jsonwebtoken";
import Ticket from "../models/Ticket";
export async function testSignUp(
  credentials = {
    email: "gkibria121@gmail.com",
    password: "testpassword",
  }
) {
  await request(app).post("/api/auth/signup").send(credentials);
}
export function testLogin(
  credentials = {
    email: "gkibria121@gmail.com",
    password: "testpassword",
  }
) {
  const jwt = sign(credentials, process.env.JWT_KEY!);

  const cookie = {
    jwt,
  };

  const cookieBase64 = Buffer.from(JSON.stringify(cookie)).toString("base64");

  return [`session=${cookieBase64}`];
}

export async function createTicket() {
  const ticket = {
    title: "some title",
    price: 100,
  };
  return await Ticket.create({
    ...ticket,
  });
}
