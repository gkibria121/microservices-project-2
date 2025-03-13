import request from "supertest";
import { app } from "../../utils/app";
import { createTicket, testLogin } from "../../helpers/test_helpers";
import Ticket from "../../models/Ticket";
import mongoose from "mongoose";

describe("Test  Tickets creation api route", () => {
  it("Should return 401 for unauthenticated users", async () => {
    const response = await request(app).post("/api/tickets/create");
    expect(response.statusCode).toBe(403);
  });
  it("Should not  return 401 for authenticated users", async () => {
    const response = await request(app)
      .post("/api/tickets/create")
      .set("Cookie", testLogin());
    expect(response.statusCode).not.toBe(403);
  });
  it("Should return 442 for invalid title", async () => {
    const response = await request(app)
      .post("/api/tickets/create")
      .send({
        price: 100,
      })
      .set("Cookie", testLogin());
    expect(response.statusCode).toBe(442);
  });
  it("Should return 442 for invalid price", async () => {
    const response = await request(app)
      .post("/api/tickets/create")
      .send({
        title: "something",
      })
      .set("Cookie", testLogin());
    expect(response.statusCode).toBe(442);
  });
  it("Should return 442 for invalid title and price", async () => {
    const response = await request(app)
      .post("/api/tickets/create")
      .set("Cookie", testLogin());
    expect(response.statusCode).toBe(442);
  });
  it("Should return 201 for submitting valid title and price by a authenticated uesr", async () => {
    let tickets = (await Ticket.find({})).length;
    const ticketAttr = {
      title: "something",
      price: 100,
    };
    expect(tickets).toBe(0);

    const response = await request(app)
      .post("/api/tickets/create")
      .send(ticketAttr)
      .set("Cookie", testLogin());
    expect(response.statusCode).toBe(201);

    tickets = (await Ticket.find({})).length;
    expect(tickets).toBe(1);
    expect(response.body.data.title).toBe(ticketAttr.title);
    expect(response.body.data.price).toBe(ticketAttr.price);
  });
});

describe("Should get ticket with an id", () => {
  it("Shoult return 404 for invalid ticket id", async () => {
    const id = new mongoose.mongo.ObjectId();
    const response = await request(app).get(`/api/tickets/${id}`);
    expect(response.statusCode).toBe(404);
  });
  it("Shoult return ticket  with title and price", async () => {
    const ticket = await createTicket();
    console.log(ticket);

    const response = await request(app).get(`/api/tickets/${ticket._id}`);
    expect(response.body.title).toBe(ticket.title);
    expect(response.body.price).toBe(ticket.price);
  });
});

describe("Should get tickets", () => {
  it("Shoult return empty list", async () => {
    const response = await request(app).get(`/api/tickets`);

    expect(response.body.tickets.length).toBe(0);
  });
  it("Shoult return ticket list", async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app).get(`/api/tickets`);
    expect(response.body.tickets.length).toBe(3);
  });
});
describe("Should update ticket", () => {
  it("Shoult return 403 for different user", async () => {
    const id = (await createTicket())._id;
    const response = await request(app).put(`/api/tickets/${id}`);

    expect(response.statusCode).toBe(403);
  });
  it("Shoult return 404 for   ticket not found", async () => {
    const id = (await createTicket())._id;
    const response = await request(app).put(`/api/tickets/${id}`);
    console.log(id, response.body);
    expect(response.statusCode).toBe(404);
  });
  it("Shoult return 442 for  invalid title", async () => {
    const id = (await createTicket())._id;
    const response = await request(app).put(`/api/tickets/${id}`).send({
      price: 100,
    });
    expect(response.statusCode).toBe(442);
  });
  it("Shoult return 442 for  invalid price", async () => {
    const id = (await createTicket())._id;
    const response = await request(app).put(`/api/tickets/${id}`).send({
      title: "sometitle",
    });
    expect(response.statusCode).toBe(442);
  });
  it("Shoult return 442 for  invalid title and price", async () => {
    const id = (await createTicket())._id;
    const response = await request(app).put(`/api/tickets/${id}`);
    expect(response.statusCode).toBe(442);
  });
  it("Shoult return 200 for  ticket udpate", async () => {
    const id = (await createTicket())._id;
    const response = await request(app).put(`/api/tickets/${id}`).send({
      title: "updated title",
      price: 100,
    });
    expect(response.statusCode).toBe(200);
  });
});
