import { Router } from "express";
import {
   getThreadsByVillage,
   createThread,
} from "../controllers/thread.controller";

const router = Router();

router.get("/village/:villageId", getThreadsByVillage);
router.post("/", createThread);

export default router;
