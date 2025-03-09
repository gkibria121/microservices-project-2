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

describe("Signin Route", () => {
  it("should return 442 if email and password are missing", async () => {
    const response = await request(app).post("/api/auth/signin").send({});
    expect(response.status).toBe(442);
  });

  it("should return 442 if email is missing", async () => {
    const response = await request(app).post("/api/auth/signin").send({
      password: "randompass",
    });
    expect(response.status).toBe(442);
  });

  it("should return 442 if password is missing", async () => {
    const response = await request(app).post("/api/auth/signin").send({
      email: "test@email.com",
    });
    expect(response.status).toBe(442);
  });

  it("should return 442 if email format is invalid", async () => {
    const response = await request(app).post("/api/auth/signin").send({
      email: "invalid-email",
      password: "password123",
    });
    expect(response.status).toBe(442);
  });

  it("should return 442 for incorrect email", async () => {
    await testLogin();
    const response = await request(app).post("/api/auth/signin").send({
      email: "wrongemail@gmail.com",
      password: "testpassword",
    });
    expect(response.status).toBe(442);
  });

  it("should return 442 for incorrect password", async () => {
    await testLogin();
    const response = await request(app).post("/api/auth/signin").send({
      email: "gkibria121@gmail.com",
      password: "wrongpassword",
    });
    expect(response.status).toBe(442);
  });

  it("should return user details upon successful signin", async () => {
    const credentials = {
      email: "gkibria121@gmail.com",
      password: "testpassword",
    };
    await testLogin(credentials);

    const response = await request(app)
      .post("/api/auth/signin")
      .send(credentials);

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe(credentials.email);
    expect(response.body.user.id).toBeDefined();
  });

  it("should return a session cookie upon successful login", async () => {
    const credentials = {
      email: "gkibria121@gmail.com",
      password: "testpassword",
    };
    await testLogin(credentials);

    const response = await request(app)
      .post("/api/auth/signin")
      .send(credentials);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe("Signup Route", () => {
  it("should return 442 if email and password are missing", async () => {
    const response = await request(app).post("/api/auth/signup").send({});
    expect(response.status).toBe(442);
  });

  it("should return 442 if email is missing", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      password: "randompass",
    });
    expect(response.status).toBe(442);
  });

  it("should return 442 if password is missing", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      email: "test@email.com",
    });
    expect(response.status).toBe(442);
  });

  it("should return 442 if email format is invalid", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      email: "invalid-email",
      password: "password123",
    });
    expect(response.status).toBe(442);
  });

  it("should create a new user and return user details", async () => {
    const credentials = {
      email: "gkibria121@gmail.com",
      password: "testpassword",
    };
    const response = await request(app)
      .post("/api/auth/signup")
      .send(credentials);

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe(credentials.email);
    expect(response.body.user.id).toBeDefined();
  });
});

describe("Signout Route", () => {
  it("should clear the session cookie on signout", async () => {
    await testLogin();
    const response = await request(app).post("/api/auth/signout");
    expect(response.get("Set-Cookie")).toBeUndefined();
  });
});
