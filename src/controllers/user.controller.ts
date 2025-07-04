import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import User from "../models/User";

export const getAllUsers = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const users = await User.find().select(
         "username email avatar avatarColor createdAt updatedAt"
      );
      res.json(users);
   } catch (error: any) {
      res.status(500).json({ message: "Error fetching users" });
   }
};

export const getMyProfile = async (
   req: AuthenticatedRequest,
   res: Response
): Promise<void> => {
   const userId = (req as any).userId;

   try {
      console.log("userId desde token:", userId);

      const user = await User.findById(userId).select(
         "username email avatar avatarColor createdAt updatedAt"
      );

      if (!user) {
         res.status(404).json({ message: "User not found" });
         return;
      }

      res.json(user);
   } catch (error: any) {
      console.error("Error al buscar el usuario:", error);
      res.status(500).json({ message: "Error fetching user" });
   }
};

import bcrypt from "bcrypt";

export const updateUserProfile = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { id } = req.params;
   const { avatar, avatarColor, password } = req.body;

   try {
      const updateData: any = {};

      if (avatar) updateData.avatar = avatar;
      if (avatarColor) updateData.avatarColor = avatarColor;
      if (password) {
         const saltRounds = 10;
         updateData.passwordHash = await bcrypt.hash(password, saltRounds);
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
         new: true,
      }).select("_id email avatar avatarColor updatedAt");

      if (!updatedUser) {
         res.status(404).json({ message: "User not found" });
         return;
      }

      res.json(updatedUser);
   } catch (error: any) {
      res.status(500).json({ message: "Error updating user profile" });
   }
};
