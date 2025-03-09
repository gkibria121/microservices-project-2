import request from "supertest";
import { app } from "../utils/app";
export async function testLogin(
  credentials = {
    email: "gkibria121@gmail.com",
    password: "testpassword",
  }
) {
  await request(app).post("/api/auth/signup").send(credentials);
}
