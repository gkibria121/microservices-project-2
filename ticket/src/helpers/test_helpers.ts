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
export function testLogin(
  credentials = {
    email: "gkibria121@gmail.com",
    password: "testpassword",
  }
) {
  const cookie = {
    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imh1d3VAbWFpbGluYXRvci5jb20iLCJpZCI6IjY3ZDJiODJlMmFhZWEzYzIxYjI3MTM2MyIsImlhdCI6MTc0MTg2Mjk2M30.o91ipakFbIS_X4ccEbxofGF23e9TeSIsHQ_IDDZAlQU",
  };

  const cookieBase64 = Buffer.from(JSON.stringify(cookie)).toString("base64");

  return [`session=${cookieBase64}`];
}
