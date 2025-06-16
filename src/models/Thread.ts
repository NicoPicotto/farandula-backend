import { Schema, model } from "mongoose";
import { IThread } from "../interfaces/thread.interface";

const threadSchema = new Schema<IThread>(
   {
      title: { type: String, required: true },
      body: { type: String, required: true },
      village: { type: Schema.Types.ObjectId, ref: "Village", required: true },
      createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
      views: { type: Number, default: 0 },
   },
   {
      timestamps: true,
   }
);

export default model<IThread>("Thread", threadSchema);
