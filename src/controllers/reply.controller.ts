import { Request, Response, NextFunction, RequestHandler } from "express";
import Reply from "../models/Reply";

interface CreateReplyBody {
   body: string;
   thread: string;
   createdBy: string;
}

export const getRepliesByThread: RequestHandler = async (req, res, next) => {
   const { threadId } = req.params;

   try {
      const replies = await Reply.find({ thread: threadId }).populate(
         "createdBy",
         "username"
      );
      res.json(replies);
   } catch (error) {
      res.status(500).json({ message: "Error fetching replies" });
   }
};

export const createReply: RequestHandler<{}, any, CreateReplyBody> = async (
   req,
   res,
   next
) => {
   const { body, thread, createdBy } = req.body;

   try {
      const reply = await Reply.create({ body, thread, createdBy });
      res.status(201).json(reply);
   } catch (error) {
      res.status(500).json({ message: "Error creating reply" });
   }
};
