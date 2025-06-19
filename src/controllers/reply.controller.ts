import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import Reply from "../models/Reply";

interface CreateReplyBody {
   body: string;
   thread: string;
   createdBy: string;
}

export const getRepliesByThread = async (
   req: Request<{ threadId: string }>,
   res: Response
): Promise<void> => {
   const { threadId } = req.params;

   try {
      const replies = await Reply.find({ thread: threadId }).populate(
         "createdBy",
         "username avatar"
      );
      res.json(replies);
   } catch (error) {
      console.error("ERROR EN getRepliesByThread:", error);
      res.status(500).json({ message: "Error fetching replies" });
   }
};

export const createReply = async (
   req: AuthenticatedRequest,
   res: Response
): Promise<void> => {
   const { body, thread } = req.body;
   const createdBy = req.userId;

   if (!body || !thread || !createdBy) {
      res.status(400).json({ message: "Missing required fields" });
      return;
   }

   try {
      const reply = await Reply.create({ body, thread, createdBy });
      res.status(201).json(reply);
   } catch (error) {
      console.error("ERROR EN createReply:", error);
      res.status(500).json({ message: "Error creating reply" });
   }
};
