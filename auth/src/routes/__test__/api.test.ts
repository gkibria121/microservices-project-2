import { app } from "../../utils/app";
import request from "supertest";
describe("API Routes", () => {
  // Set up environment variables or other global setup here
  beforeAll(() => {
    process.env.JWT_KEY = "somerandomtxt"; // Set up environment variable before tests
  });

  it("should return 404 for non-existent routes", async () => {
    const response = await request(app).get("/nonexistent-route"); // Example of invalid route
    expect(response.status).toBe(404); // Expecting a 404 status code
    expect(response.body.message).toBe("Api endpoint not found!"); // Ensure the correct error message is returned
  });
});
