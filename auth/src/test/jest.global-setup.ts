import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { beforeAll, afterAll } from "@jest/globals";

declare global {
  namespace NodeJS {
    interface Global {
      testData?: {
        user: string;
        isActive: boolean;
      };
    }
  }
  // Or directly extend globalThis
}

beforeAll(() => {
  console.log("🚀 Global Setup: Initializing resources...");
  process.env.JWT_KEY = "somerandomtxt";
  global.testData = { user: "test-user", isActive: true };
});

afterAll(() => {
  console.log("🧹 Global Teardown: Cleaning up...");
  delete global.testData;
});
