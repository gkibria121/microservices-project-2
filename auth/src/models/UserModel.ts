import { Schema, model, models, Model, Document } from "mongoose";
import bcrypt from "bcrypt";
interface IUser extends Document {
  email: string;
  password: string;
}

interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUser, IUserModel>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
); // Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is modified

  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);

    console.log(this.password);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Export the Model (with caching for hot reload environments like Next.js)
const User =
  (models.UserModel as IUserModel) ||
  model<IUser, IUserModel>("UserModel", userSchema);

export default User;
