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
