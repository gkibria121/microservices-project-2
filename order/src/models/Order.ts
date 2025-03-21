import mongoose, { model, Schema } from "mongoose";
import { TicketDoc } from "./Ticket";
import { OrderStatus } from "@_gktickets/common";
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}
interface OrderModel extends mongoose.Model<OrderDoc> {
  userId: String;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}
const ticketSchema = new Schema<OrderDoc, OrderModel>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: Schema.Types.Date,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export default model("Order", ticketSchema);
