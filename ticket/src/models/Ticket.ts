import mongoose, { model } from "mongoose";

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
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

export default model("Ticket", ticketSchema);
