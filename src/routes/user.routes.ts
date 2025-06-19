import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/user.controller";
import { updateUserProfile } from "../controllers/user.controller";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUserProfile);

export default router;
