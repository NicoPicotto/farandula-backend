import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import Thread from "../models/Thread";
import Reply from "../models/Reply";

export const getThreadsByVillage: RequestHandler = async (req, res, next) => {
   const { villageId } = req.params;
   const page = parseInt(req.query.page as string) || 1;
   const limit = parseInt(req.query.limit as string) || 10;
   const skip = (page - 1) * limit;

   try {
      const search = (req.query.search as string) || "";
      const searchRegex = new RegExp(search, "i");

      const query: Record<string, any> = {
         village: villageId,
      };

      if (search) {
         query.$or = [{ title: searchRegex }, { body: searchRegex }];
      }

      const threads = await Thread.find(query)
         .populate("createdBy", "username avatar avatarColor")
         .select("+views")
         .skip(skip)
         .limit(limit)
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

      const total = await Thread.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const hasMore = page < totalPages;

      res.json({
         threads: enrichedThreads,
         pagination: {
            total,
            totalPages,
            currentPage: page,
            hasMore,
         },
      });
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
         .populate("createdBy", "username avatar avatarColor")
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

export const updateThread: RequestHandler = async (
   req: AuthenticatedRequest,
   res,
   next
) => {
   const { threadId } = req.params;
   const { title, body } = req.body;
   const userId = req.userId;
   try {
      const thread = await Thread.findById(threadId);

      if (!thread) {
         res.status(404).json({ message: "Thread not found" });
         return;
      }
      // Sólo el creador puede editar
      if (thread.createdBy.toString() !== userId) {
         res.status(403).json({
            message: "Not authorized to edit this thread",
         });
         return;
      }
      // Actualizar campos si vienen en el body
      if (title !== undefined) thread.title = title;
      if (body !== undefined) thread.body = body;
      const updated = await thread.save();
      res.json(updated);
   } catch (error) {
      next(error);
   }
};
