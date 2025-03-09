import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { beforeAll, afterAll, afterEach } from "@jest/globals";

let mongo: MongoMemoryServer;

beforeAll(async () => {
  console.log("🚀 Global Setup: Initializing resources...");
  mongo = await MongoMemoryServer.create();
  process.env.JWT_KEY = "somerandomtxt";
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  await mongoose.connection.dropDatabase(); // Clear the database after each test
});

afterAll(async () => {
  console.log("🧹 Global Teardown: Cleaning up...");
  await mongoose.disconnect();
  if (mongo) await mongo.stop(); // Ensure final cleanup
});
