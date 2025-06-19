import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { generateToken } from "../utils/jtw";
import { Types } from "mongoose";
import { RegisterBody, LoginBody } from "../interfaces/auth.interface";

export const register = async (
   req: Request<{}, {}, RegisterBody>,
   res: Response
): Promise<void> => {
   const { username, email, password } = req.body;
   try {
      const existing = await User.findOne({ $or: [{ username }, { email }] });
      if (existing) {
         res.status(400).json({ message: "Username or email already in use" });
         return;
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const avatar = req.body.avatar || "notionist-neutral";
      const user = await User.create({ username, email, passwordHash, avatar });
      const token = generateToken((user._id as Types.ObjectId).toString());
      res.status(201).json({
         token,
         user: {
            id: (user._id as Types.ObjectId).toString(),
            username: user.username,
            email: user.email,
            avatar: user.avatar,
         },
      });
   } catch (error: any) {
      res.status(500).json({ message: error.message });
   }
};

export const login = async (
   req: Request<{}, {}, LoginBody>,
   res: Response
): Promise<void> => {
   const { email, password } = req.body;
   try {
      const user = await User.findOne({ email });
      if (!user) {
         res.status(400).json({ message: "Invalid credentials" });
         return;
      }
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
         res.status(400).json({ message: "Invalid credentials" });
         return;
      }
      const token = generateToken((user._id as Types.ObjectId).toString());
      res.json({
         token,
         user: {
            id: (user._id as Types.ObjectId).toString(),
            username: user.username,
            email: user.email,
            avatar: user.avatar,
         },
      });
   } catch (error: any) {
      res.status(500).json({ message: error.message });
   }
};
