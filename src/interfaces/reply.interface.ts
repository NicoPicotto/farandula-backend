import { Document, Types } from "mongoose";

export interface IReply extends Document {
   body: string;
   thread: Types.ObjectId;
   createdBy: Types.ObjectId;
   createdAt: Date;
   updatedAt: Date;
}
