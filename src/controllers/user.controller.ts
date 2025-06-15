import { Request, Response } from "express";
import User from "../models/User";

export const getAllUsers = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const users = await User.find().select(
         "username email createdAt updatedAt"
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
         "username email createdAt updatedAt"
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
