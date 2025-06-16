import { Router } from "express";
import {
   getThreadsByVillage,
   createThread,
   getThreadById,
} from "../controllers/thread.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/village/:villageId", getThreadsByVillage);
router.get("/:threadId", getThreadById);
router.post("/", authMiddleware, createThread);

export default router;
