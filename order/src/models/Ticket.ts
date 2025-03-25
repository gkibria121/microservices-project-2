import mongoose, { model, Schema } from "mongoose";

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
}

const ticketSchema = new Schema<TicketDoc>({
  title: String,
  price: Number,
  userId: String,
  version: Number,
});
export { TicketDoc };
export default model("Ticket", ticketSchema);
