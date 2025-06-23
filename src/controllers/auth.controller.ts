import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import { Types } from "mongoose";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import { RegisterBody, LoginBody } from "../interfaces/auth.interface";

const resend = new Resend(process.env.RESEND_API_KEY!);

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
      const avatarColor = req.body.avatarColor;
      const user = await User.create({
         username,
         email,
         passwordHash,
         avatar,
         avatarColor,
      });
      const token = generateToken((user._id as Types.ObjectId).toString());
      res.status(201).json({
         token,
         user: {
            id: (user._id as Types.ObjectId).toString(),
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            avatarColor: user.avatarColor,
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
            avatarColor: user.avatarColor,
         },
      });
   } catch (error: any) {
      res.status(500).json({ message: error.message });
   }
};

export const requestPasswordReset = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { email } = req.body;

   try {
      const user = await User.findOne({ email });
      if (!user) {
         res.status(200).json({
            message:
               "Si el email existe, se ha enviado un enlace de restablecimiento.",
         });
         return;
      }

      const token = jwt.sign({ email }, process.env.PASSWORD_RESET_SECRET!, {
         expiresIn: "1h",
      });

      const resetLink = `https://farandulacordobesa.com.ar/cambiar-password?token=${token}&email=${email}`;

      const { data, error } = await resend.emails.send({
         from: "Farandula <no-reply@farandulacordobesa.com.ar>",
         to: email,
         subject: "Restablecer tu contraseña",
         html: `<p>Hacé clic en el siguiente enlace para cambiar tu contraseña:</p>
         <p><a href="${resetLink}">${resetLink}</a></p>
         <p>Este enlace expirará en 1 hora.</p>`,
      });

      if (error) {
         console.error("Error al enviar email con Resend:", error);
      } else {
         console.log("Email enviado correctamente con Resend:", data);
      }

      res.status(200).json({
         message:
            "Si el email existe, se ha enviado un enlace de restablecimiento.",
      });
      return;
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error sending reset email" });
      return;
   }
};

export const resetPassword = async (
   req: Request,
   res: Response
): Promise<void> => {
   const { email, token, newPassword } = req.body;

   try {
      const decoded = jwt.verify(token, process.env.PASSWORD_RESET_SECRET!) as {
         email: string;
      };

      if (decoded.email !== email) {
         res.status(400).json({ message: "Token o email inválido." });
         return;
      }

      const user = await User.findOne({ email });
      if (!user) {
         res.status(400).json({ message: "Usuario no encontrado." });
         return;
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.passwordHash = passwordHash;
      await user.save();

      res.status(200).json({
         message: "Tu contraseña se cambió correctamente.",
      });
      return;
   } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Token inválido o expirado." });
      return;
   }
};
