import { Schema, model } from "mongoose";
import { IReply } from "../interfaces/reply.interface";

const replySchema = new Schema<IReply>(
   {
      body: { type: String, required: true },
      thread: { type: Schema.Types.ObjectId, ref: "Thread", required: true },
      createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
   },
   {
      timestamps: true,
   }
);

export default model<IReply>("Reply", replySchema);
