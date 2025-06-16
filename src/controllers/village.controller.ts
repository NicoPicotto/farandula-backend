import { Request, Response } from "express";
import Village from "../models/Village";
import Thread from "../models/Thread";
import Reply from "../models/Reply";

export const getAllVillages = async (req: Request, res: Response) => {
   try {
      const villages = await Village.find();

      const villagesWithCounts = await Promise.all(
         villages.map(async (village) => {
            const threadCount = await Thread.countDocuments({
               village: village._id,
            });
            const replyCount = await Reply.countDocuments({
               village: village._id,
            });

            return {
               _id: village._id,
               name: village.name,
               slug: village.slug,
               description: village.description,
               threadCount,
               replyCount,
            };
         })
      );

      res.json(villagesWithCounts);
   } catch (error) {
      res.status(500).json({ message: "Error fetching villages" });
   }
};
