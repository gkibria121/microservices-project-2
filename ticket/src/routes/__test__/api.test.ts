import request from "supertest";
import { app } from "../../utils/app";
import { createTicket, testLogin } from "../../helpers/test_helpers";
import Ticket from "../../models/Ticket";
import mongoose from "mongoose";

describe("Ticket Creation API", () => {
  it("Should return 401 for unauthenticated users", async () => {
    const response = await request(app).post("/api/tickets/create");
    expect(response.statusCode).toBe(403);
  });

  it("Should allow authenticated users to create tickets", async () => {
    const response = await request(app)
      .post("/api/tickets/create")
      .set("Cookie", testLogin());
    expect(response.statusCode).not.toBe(403);
  });

  it("Should return 442 for missing title", async () => {
    const response = await request(app)
      .post("/api/tickets/create")
      .send({ price: 100 })
      .set("Cookie", testLogin());
    expect(response.statusCode).toBe(442);
  });

  it("Should return 442 for missing price", async () => {
    const response = await request(app)
      .post("/api/tickets/create")
      .send({ title: "something" })
      .set("Cookie", testLogin());
    expect(response.statusCode).toBe(442);
  });

  it("Should return 442 for missing title and price", async () => {
    const response = await request(app)
      .post("/api/tickets/create")
      .set("Cookie", testLogin());
    expect(response.statusCode).toBe(442);
  });

  it("Should create a ticket with valid title and price", async () => {
    let tickets = (await Ticket.find({})).length;
    const ticketAttr = { title: "something", price: 100 };

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

describe("Ticket Retrieval API", () => {
  it("Should return 404 for invalid ticket id", async () => {
    const id = new mongoose.mongo.ObjectId();
    const response = await request(app).get(`/api/tickets/${id}`);
    expect(response.statusCode).toBe(404);
  });

  it("Should return ticket with valid id", async () => {
    const ticket = await createTicket();

    const response = await request(app).get(`/api/tickets/${ticket._id}`);
    expect(response.body.title).toBe(ticket.title);
    expect(response.body.price).toBe(ticket.price);
  });

  it("Should return an empty list when no tickets exist", async () => {
    const response = await request(app).get(`/api/tickets`);
    expect(response.body.tickets.length).toBe(0);
  });

  it("Should return a list of tickets", async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app).get(`/api/tickets`);
    expect(response.body.tickets.length).toBe(3);
  });
});

describe("Ticket Update API", () => {
  it("Should return 403 for unauthorized user", async () => {
    const id = (await createTicket())._id;
    const response = await request(app)
      .put(`/api/tickets/${id}`)
      .set("Cookie", testLogin());

    expect(response.statusCode).toBe(401);
  });

  it("Should return 404 for ticket not found", async () => {
    const credentials = { email: "random@mail.com", id: "12345" };
    const id = new mongoose.mongo.ObjectId();

    const response = await request(app)
      .put(`/api/tickets/${id}`)
      .set("Cookie", testLogin(credentials))
      .send({ price: 100, title: "test this" });

    expect(response.statusCode).toBe(404);
  });

  it("Should return 442 for missing title", async () => {
    const credentials = { email: "random@mail.com", id: "12345" };
    const id = (await createTicket(credentials.id))._id;

    const response = await request(app)
      .put(`/api/tickets/${id}`)
      .set("Cookie", testLogin(credentials))
      .send({ price: 100 });

    expect(response.statusCode).toBe(442);
  });

  it("Should return 442 for missing price", async () => {
    const credentials = { email: "random@mail.com", id: "12345" };
    const id = (await createTicket(credentials.id))._id;

    const response = await request(app)
      .put(`/api/tickets/${id}`)
      .set("Cookie", testLogin(credentials))
      .send({ title: "sometitle" });

    expect(response.statusCode).toBe(442);
  });

  it("Should update ticket with valid data", async () => {
    const credentials = { email: "random@mail.com", id: "12345" };
    const newTicket = { title: "updated title", price: 100 };
    const id = (await createTicket(credentials.id))._id;

    const response = await request(app)
      .put(`/api/tickets/${id}`)
      .set("Cookie", testLogin(credentials))
      .send(newTicket);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(newTicket.title);
    expect(response.body.price).toBe(newTicket.price);
  });
});
describe("Ticket Delete API", () => {
  it("Should return 403 for unauthorized user", async () => {
    const id = (await createTicket())._id;
    const response = await request(app)
      .delete(`/api/tickets/${id}`)
      .set("Cookie", testLogin());

    expect(response.statusCode).toBe(401);
  });

  it("Should return 404 for ticket not found", async () => {
    const credentials = { email: "random@mail.com", id: "12345" };
    const id = new mongoose.mongo.ObjectId();

    const response = await request(app)
      .delete(`/api/tickets/${id}`)
      .set("Cookie", testLogin(credentials));

    expect(response.statusCode).toBe(404);
  });

  it("Should delete ticket with user and ticket_id", async () => {
    const credentials = { email: "random@mail.com", id: "12345" };
    const id = (await createTicket(credentials.id))._id;
    let tickets = (await Ticket.find({})).length;
    expect(tickets).toBe(1);
    const response = await request(app)
      .delete(`/api/tickets/${id}`)
      .set("Cookie", testLogin(credentials));

    expect(response.statusCode).toBe(204);
    tickets = (await Ticket.find({})).length;
    expect(tickets).toBe(0);
  });
});
