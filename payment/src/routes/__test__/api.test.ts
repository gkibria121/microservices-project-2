import { testLogin } from "../../helpers/test_helpers";
import { app } from "../../utils/app";
import request from "supertest";

describe("API Routes", () => {
  it("should return 404 for an unknown route", async () => {
    const response = await request(app).get("/nonexistent-route");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Api endpoint not found!");
  });
});

it.todo("Should return 442 if orderId is not provided");
it.todo("Should return 442 if token is not provided");
it.todo("Should return 442 if orderId and token is not provided");
it.todo("Should return error if order is not found!");
it.todo("Should call stripe api and fail  with invalid token");
it.todo("Should call stripe api and fail  with insufficient balance");
it.todo("Should call stripe api and pay with token");
it.todo("Should publish payment created event");
it.todo("Should return 200 with  payment object");
