import { Document } from "mongoose";

export interface IVillage extends Document {
   name: string;
   slug: string;
   description?: string;
   threadCount?: number;
   replyCount?: number;
}
