import mongoose from "mongoose";
import { createOrder, testLogin } from "../../helpers/test_helpers";
import { app } from "../../utils/app";
import request from "supertest";
import { randomBytes } from "crypto";
import { OrderStatus } from "@_gktickets/common";
describe("API Routes", () => {
  it("should return 404 for an unknown route", async () => {
    const response = await request(app).get("/nonexistent-route");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Api endpoint not found!");
  });
});

it("Should return 442 if orderId is not provided", async () => {
  const response = await request(app)
    .post("/api/payments/pay")
    .send({ token: randomBytes(10).toString() })
    .set("Cookie", testLogin());

  expect(response.status).toBe(442);
});
it("Should return 442 if token is not provided", async () => {
  const response = await request(app)
    .post("/api/payments/pay")
    .send({
      orderId: new mongoose.mongo.ObjectId(),
    })
    .set("Cookie", testLogin());
  expect(response.status).toBe(442);
});
it("Should return 442 if orderId and token is not provided", async () => {
  const response = await request(app)
    .post("/api/payments/pay")
    .set("Cookie", testLogin());
  expect(response.status).toBe(442);
});
it("Should return not error 442 if orderId and token is provided", async () => {
  const response = await request(app)
    .post("/api/payments/pay")
    .send({
      orderId: new mongoose.mongo.ObjectId(),
      token: randomBytes(10).toString(),
    })
    .set("Cookie", testLogin());
  expect(response.status).not.toBe(442);
});
it("Should return 404 error if order is not found!", async () => {
  const response = await request(app)
    .post("/api/payments/pay")
    .send({
      orderId: new mongoose.mongo.ObjectId(),
      token: randomBytes(10).toString(),
    })
    .set("Cookie", testLogin());
  expect(response.status).toBe(404);
});
it("Should return 403 if order is cancelled", async () => {
  const order = await createOrder({
    status: OrderStatus.Cancelled,
  });

  const response = await request(app)
    .post("/api/payments/pay")
    .send({
      orderId: order._id,
      token: randomBytes(10).toString(),
    })
    .set("Cookie", testLogin());
  expect(response.status).toBe(403);
});
it.todo("Should call stripe api and fail  with invalid token");
it.todo("Should call stripe api and fail  with insufficient balance");
it.todo("Should call stripe api and pay with token");
it.todo("Should publish payment created event");
it.todo("Should return 200 with  payment object");
