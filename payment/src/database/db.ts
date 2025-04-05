import mongoose from "mongoose";
export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("Connected to db 😁");
  } catch (error) {
    console.error(error);
    console.log("Unable to connect to MongoDB 😓");
  }
}
