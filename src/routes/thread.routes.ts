import { Router } from "express";
import {
   getThreadsByVillage,
   createThread,
} from "../controllers/thread.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/village/:villageId", getThreadsByVillage);
router.post("/", authMiddleware, createThread);

export default router;
