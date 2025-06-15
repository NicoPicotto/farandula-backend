import { Router } from "express";
import {
   getRepliesByThread,
   createReply,
} from "../controllers/reply.controller";

const router = Router();

router.get("/thread/:threadId", getRepliesByThread);
router.post("/", createReply);

export default router;
