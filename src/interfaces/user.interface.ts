import { Document } from "mongoose";

export interface IUser extends Document {
   username: string;
   email: string;
   passwordHash: string;
   avatar: string;
   avatarColor: string;
   createdAt: Date;
   updatedAt: Date;
}
