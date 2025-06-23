import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "default_secret";

export const generateToken = (userId: string): string => {
   return jwt.sign({ userId }, SECRET, { expiresIn: "30d" });
};

interface JwtPayload {
   userId: string;
   iat: number;
   exp: number;
}

export const verifyToken = (token: string): JwtPayload => {
   return jwt.verify(token, SECRET) as JwtPayload;
};
