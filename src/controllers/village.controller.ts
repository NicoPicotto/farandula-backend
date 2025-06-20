import { Request, Response } from "express";
import Village from "../models/Village";
import Thread from "../models/Thread";
import Reply from "../models/Reply";

export const getAllVillages = async (req: Request, res: Response) => {
   try {
      const search = (req.query.search as string) || "";
      const searchRegex = new RegExp(search, "i");

      const villages = await Village.find({
         name: { $regex: searchRegex },
      }).sort({ name: 1 });

      const villagesWithCounts = await Promise.all(
         villages.map(async (village) => {
            const threads = await Thread.find({ village: village._id }).select(
               "_id"
            );
            const threadIds = threads.map((t) => t._id);

            const replyCount = await Reply.countDocuments({
               thread: { $in: threadIds },
            });

            const threadCount = threadIds.length;

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
