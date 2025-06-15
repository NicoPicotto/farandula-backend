import { Document, Types } from "mongoose";

export interface IThread extends Document {
   title: string;
   body: string;
   village: Types.ObjectId;
   createdBy: Types.ObjectId | Record<string, any>;
   createdAt: Date;
   updatedAt: Date;
}
