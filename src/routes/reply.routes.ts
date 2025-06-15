import { Router } from "express";
import {
   getRepliesByThread,
   createReply,
} from "../controllers/reply.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/thread/:threadId", getRepliesByThread);
router.post("/", authMiddleware, createReply);

export default router;
