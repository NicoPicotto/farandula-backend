import { Request, Response, NextFunction } from "express";
import Thread from "../models/Thread";

export const getThreadsByVillage = async (req: Request, res: Response) => {
   const { villageId } = req.params;

   try {
      const threads = await Thread.find({ village: villageId }).populate(
         "createdBy",
         "username"
      );
      res.json(threads);
   } catch (error) {
      res.status(500).json({ message: "Error fetching threads" });
   }
};

export const createThread = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> => {
   const { title, body, village, createdBy } = req.body;

   if (!title || !body || !village || !createdBy) {
      res.status(400).json({ message: "Missing required fields" });
      return;
   }

   try {
      const thread = await Thread.create({ title, body, village, createdBy });
      res.status(201).json(thread);
   } catch (error: any) {
      console.error(error); // <— ver el error real
      res.status(500).json({ message: error.message });
   }
};
