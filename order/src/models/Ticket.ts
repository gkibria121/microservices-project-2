import mongoose, { model, Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
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

ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.set("versionKey", "version");

export { TicketDoc };
export default model("Ticket", ticketSchema);
