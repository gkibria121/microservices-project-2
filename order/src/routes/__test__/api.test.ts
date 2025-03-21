import request from "supertest";
import { app } from "../../utils/app";
import { createTicket, testLogin } from "../../helpers/test_helpers";
// import Ticket from "../../models/Ticket";
import mongoose from "mongoose";
import { natsWrapper } from "../../lib/natas-client";

describe("Order Creation API", () => {
  it("Should return 401 for unauthenticated users", async () => {});

  it("Should allow authenticated users to create orders", async () => {});

  it("Should return 442 for missing ticket id", async () => {});
  it("Should return 442 if ticket id used for another order", async () => {});
  it("Should return 404 if ticket id not found", async () => {});
  it("Should create a order with a valid ticket id", async () => {
    // expect to return userId,status,expiresAt, ticketId
  });
});

describe("Order Retrieval API", () => {
  it("Should return 404 for invalid order id", async () => {});
  it("Should return 403 if order does not belongs to the user", async () => {});
  it("Should return order with valid id", async () => {});

  it("Should return an empty list when no orders exist", async () => {});

  it("Should return a list of orders", async () => {});
});

describe("Order Delete API", () => {
  it("Should return 403 for unauthorized user", async () => {});

  it("Should return 404 for order not found", async () => {});

  it("Should delete order with user and order_id", async () => {});
});

describe("should have emitted events", () => {
  it("should have called ticket created event!", async () => {});

  it("should have called ticket deleted event!", async () => {});
});
