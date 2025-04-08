import mongoose, { model, Schema } from "mongoose";
import { OrderStatus } from "@_gktickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  price: number;
  version: number;
}

const orderSchema = new Schema<OrderDoc>(
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
    price: {
      type: Number,
      required: true,
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
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

export default model("Order", orderSchema);
