import { Router } from "express";
import {
   updateUserProfile,
   getMyProfile,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

//router.get("/", getAllUsers);
router.get("/me", authMiddleware, getMyProfile);
router.patch("/:id", updateUserProfile);

export default router;
