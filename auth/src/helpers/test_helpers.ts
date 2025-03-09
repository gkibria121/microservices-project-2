import request from "supertest";
import { app } from "../utils/app";
export async function testSignUp(
  credentials = {
    email: "gkibria121@gmail.com",
    password: "testpassword",
  }
) {
  await request(app).post("/api/auth/signup").send(credentials);
}
export async function testLogin(
  credentials = {
    email: "gkibria121@gmail.com",
    password: "testpassword",
  }
) {
  const response = await request(app)
    .post("/api/auth/signin")
    .send(credentials);
  return response;
}
