import { Request, Response } from "express";
import User from "../models/User";

export const getAllUsers = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const users = await User.find().select(
         "username email avatar createdAt updatedAt"
      );
      res.json(users);
   } catch (error: any) {
      res.status(500).json({ message: "Error fetching users" });
   }
};

export const getUserById = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { id } = req.params;
   try {
      const user = await User.findById(id).select(
         "username email avatar createdAt updatedAt"
      );
      if (!user) {
         res.status(404).json({ message: "User not found" });
         return;
      }
      res.json(user);
   } catch (error: any) {
      res.status(500).json({ message: "Error fetching user" });
   }
};


import bcrypt from "bcrypt";

export const updateUserProfile = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { id } = req.params;
   const { avatar, password } = req.body;

   try {
      const updateData: any = {};

      if (avatar) updateData.avatar = avatar;
      if (password) {
         const saltRounds = 10;
         updateData.passwordHash = await bcrypt.hash(password, saltRounds);
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
         new: true,
      }).select("email avatar updatedAt");

      if (!updatedUser) {
         res.status(404).json({ message: "User not found" });
         return;
      }

      res.json(updatedUser);
   } catch (error: any) {
      res.status(500).json({ message: "Error updating user profile" });
   }
};
