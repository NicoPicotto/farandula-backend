import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
   userId?: string;
}

export const authMiddleware = (
   req: AuthenticatedRequest,
   res: Response,
   next: NextFunction
): void => {
   const header = req.headers.authorization;
   if (!header || !header.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized" });
      return;
   }
   const token = header.split(" ")[1];
   try {
      const payload = verifyToken(token);
      console.log("Payload del token:", payload);
      req.userId = payload.userId;
      next();
   } catch {
      res.status(401).json({ message: "Unauthorized" });
   }
};
