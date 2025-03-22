import request from "supertest";
import { app } from "../../utils/app";
import {
  createOrder,
  createTicket,
  testLogin,
} from "../../helpers/test_helpers";
// import Ticket from "../../models/Ticket";
import mongoose from "mongoose";
import Order from "../../models/Order";
import { OrderStatus } from "@_gktickets/common";
import { natsWrapper } from "../../lib/natas-client";

describe("Order Creation API", () => {
  it("Should return 401 for unauthenticated users", async () => {
    const response = await request(app).post("/api/orders/create").expect(403);
  });

  it("Should allow authenticated users to create orders", async () => {
    const response = await request(app)
      .post("/api/orders/create")
      .set("Cookie", testLogin());

    expect(response.statusCode).not.toBe(403);
  });

  it("Should return 442 for missing ticket id", async () => {
    const response = await request(app)
      .post("/api/orders/create")
      .set("Cookie", testLogin());

    expect(response.statusCode).toBe(442);
  });
  it("Should return 442 if ticket id used for another order", async () => {
    const order = await createOrder();
    const response = await request(app)
      .post("/api/orders/create")
      .send({
        ticketId: order.ticket._id,
      })
      .set("Cookie", testLogin());

    expect(response.statusCode).toBe(442);
  });
  it("Should return 404 if ticket id not found", async () => {
    const response = await request(app)
      .post("/api/orders/create")
      .send({
        ticketId: new mongoose.mongo.ObjectId(),
      })
      .set("Cookie", testLogin());

    expect(response.statusCode).toBe(404);
  });
  it("Should create a order with a valid ticket id", async () => {
    const ticket = await createTicket();
    let orderCount = (await Order.find({})).length;
    expect(orderCount).toBe(0);
    const response = await request(app)
      .post("/api/orders/create")
      .send({
        ticketId: ticket._id,
      })
      .set("Cookie", testLogin());
    orderCount = (await Order.find({})).length;
    expect(orderCount).toBe(1);
    expect(response.statusCode).toBe(201);
    expect(response.body.userId).toBeDefined();
    expect(response.body.status).toBe(OrderStatus.Created);
    expect(response.body.expiresAt).toBeDefined();
    expect(response.body.ticket).toBeDefined();
  });
  it("should have called ticket created event!", async () => {
    const ticket = await createTicket();
    let orderCount = (await Order.find({})).length;
    expect(orderCount).toBe(0);
    const response = await request(app)
      .post("/api/orders/create")
      .send({
        ticketId: ticket._id,
      })
      .set("Cookie", testLogin());
    orderCount = (await Order.find({})).length;
    expect(orderCount).toBe(1);
    expect(response.statusCode).toBe(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});

describe("Order Retrieval API", () => {
  it("Should return 404 for invalid order id", async () => {
    const order_id = new mongoose.mongo.ObjectId();
    const response = await request(app)
      .get("/api/orders/" + order_id)
      .set("Cookie", testLogin());

    expect(response.statusCode).toBe(404);
  });
  it("Should return 403 if order does not belongs to the user", async () => {
    const order_id = (await createOrder())._id;
    const response = await request(app)
      .get("/api/orders/" + order_id)
      .set("Cookie", testLogin());

    expect(response.statusCode).toBe(401);
  });
  it("Should return order with valid id", async () => {
    const credentials = {
      email: "random@tmail.com",
      id: "randomId",
    };

    const order_id = (await createOrder(credentials.id))._id;
    const response = await request(app)
      .get("/api/orders/" + order_id)
      .set("Cookie", testLogin(credentials));

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBeDefined();
    expect(response.body.ticket).toBeDefined();
    expect(response.body.expiresAt).toBeDefined();
    expect(response.body.status).toBeDefined();
  });

  it("Should return an empty list when no orders exist", async () => {
    const response = await request(app)
      .get("/api/orders")
      .set("Cookie", testLogin());

    expect(response.statusCode).toBe(200);
    expect(response.body.orders.length).toBe(0);
  });

  it("Should return a list of orders", async () => {
    const credentials = {
      email: "random@tmail.com",
      id: "randomId",
    };

    await createOrder(credentials.id);
    await createOrder(credentials.id);
    await createOrder(credentials.id);
    const response = await request(app)
      .get("/api/orders")
      .set("Cookie", testLogin());

    expect(response.statusCode).toBe(200);
    expect(response.body.orders.length).toBe(3);
  });
});

describe("Order Delete API", () => {
  it("Should return 403 for unauthorized user", async () => {
    const order = await createOrder();
    const response = await request(app)
      .delete("/api/orders/" + order._id)
      .set("Cookie", testLogin());

    expect(response.statusCode).toBe(401);
  });

  it("Should return 404 for order not found", async () => {
    const response = await request(app)
      .delete("/api/orders/" + new mongoose.mongo.ObjectId())
      .set("Cookie", testLogin());

    expect(response.statusCode).toBe(404);
  });

  it("Should delete order with user and order_id", async () => {
    const credentials = {
      email: "random@tmail.com",
      id: "randomId",
    };
    const order = await createOrder(credentials.id);

    const response = await request(app)
      .delete("/api/orders/" + order._id)
      .set("Cookie", testLogin(credentials));

    expect(response.statusCode).toBe(204);
  });
  it("should have called ticket deleted event!", async () => {
    const credentials = {
      email: "random@tmail.com",
      id: "randomId",
    };
    const order = await createOrder(credentials.id);

    const response = await request(app)
      .delete("/api/orders/" + order._id)
      .set("Cookie", testLogin(credentials));

    expect(response.statusCode).toBe(204);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
