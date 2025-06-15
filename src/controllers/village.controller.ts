import { Request, Response } from "express";
import Village from "../models/Village";

export const getAllVillages = async (req: Request, res: Response) => {
   try {
      const villages = await Village.find();
      res.json(villages);
   } catch (error) {
      res.status(500).json({ message: "Error fetching villages" });
   }
};
