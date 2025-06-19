import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema<IUser>(
   {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      passwordHash: { type: String, required: true },
      avatar: { type: String, default: "notionist-neutral" },
      avatarColor: { type: String, default: "white" },
   },
   { timestamps: true }
);

export default model<IUser>("User", userSchema);
