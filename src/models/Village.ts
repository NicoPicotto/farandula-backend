import { Schema, model } from "mongoose";
import { IVillage } from "../interfaces/village.interface";

const villageSchema = new Schema<IVillage>({
   name: { type: String, required: true },
   slug: { type: String, required: true, unique: true },
   description: String,
});

export default model<IVillage>("Village", villageSchema);
