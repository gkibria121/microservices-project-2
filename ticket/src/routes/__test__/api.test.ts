import request from "supertest";
import { app } from "../../utils/app";
import { testLogin } from "../../helpers/test_helpers";
import Ticket from "../../models/Ticket";

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
