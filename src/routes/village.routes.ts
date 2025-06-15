import { Router } from "express";
import { getAllVillages } from "../controllers/village.controller";

const router = Router();

router.get("/", getAllVillages);

export default router;
