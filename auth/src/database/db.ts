import mongoose from "mongoose";
export default async function connectDB() {
  try {
    if (!process.env.MONGO_URL) throw new Error("Please provide mongo url");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to db 😁");
  } catch (error) {
    console.error(error); 
    console.log("Unable to connect to MongoDB 😓");
  }
}
