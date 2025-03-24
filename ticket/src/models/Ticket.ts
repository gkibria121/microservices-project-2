import mongoose, { model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
}

const ticketSchema = new mongoose.Schema<TicketDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    version: Number,
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        doc.id = doc._id;
        delete doc._id;
      },
    },
  }
);
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);
export default model("Ticket", ticketSchema);
