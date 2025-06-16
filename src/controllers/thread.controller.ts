import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import Thread from "../models/Thread";
import Reply from "../models/Reply";

export const getThreadsByVillage: RequestHandler = async (req, res, next) => {
   const { villageId } = req.params;

   try {
      const threads = await Thread.find({ village: villageId })
         .populate("createdBy", "username")
         .select("+views")
         .lean();

      const enrichedThreads = await Promise.all(
         threads.map(async (thread) => {
            const replyCount = await Reply.countDocuments({
               thread: thread._id,
            });
            const lastReply = await Reply.findOne({ thread: thread._id })
               .sort({ createdAt: -1 })
               .select("createdAt");

            return {
               ...thread,
               replyCount,
               lastReplyDate: lastReply?.createdAt ?? null,
            };
         })
      );

      enrichedThreads.sort((a, b) => {
         const dateA = a.lastReplyDate
            ? new Date(a.lastReplyDate).getTime()
            : 0;
         const dateB = b.lastReplyDate
            ? new Date(b.lastReplyDate).getTime()
            : 0;
         return dateB - dateA;
      });

      res.json(enrichedThreads);
      return;
   } catch (error) {
      next(error);
   }
};

export const getThreadById: RequestHandler = async (req, res, next) => {
   const { threadId } = req.params;

   try {
      const thread = await Thread.findByIdAndUpdate(
         threadId,
         { $inc: { views: 1 } },
         { new: true }
      )
         .populate("createdBy", "username")
         .populate("village", "name")
         .lean();

      if (!thread) {
         res.status(404).json({ message: "Thread not found" });
         return;
      }

      const replyCount = await Reply.countDocuments({ thread: thread._id });
      const lastReply = await Reply.findOne({ thread: thread._id })
         .sort({ createdAt: -1 })
         .select("createdAt");

      res.json({
         ...thread,
         replyCount,
         lastReplyDate: lastReply?.createdAt ?? null,
      });
      return;
   } catch (error) {
      next(error);
   }
};

export const createThread = async (
   req: AuthenticatedRequest,
   res: Response,
   next: NextFunction
): Promise<void> => {
   const { title, body, village } = req.body;
   const createdBy = req.userId;
   console.log("UserId extraído del token:", createdBy);

   if (!title || !body || !village) {
      res.status(400).json({ message: "Missing required fields" });
      return;
   }
   if (!createdBy) {
      res.status(401).json({ message: "User not authenticated" });
   }

   try {
      const thread = await Thread.create({ title, body, village, createdBy });
      res.status(201).json(thread);
   } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message });
   }
};
