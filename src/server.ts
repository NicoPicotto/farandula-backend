import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import villageRoutes from "./routes/village.routes";
import threadsRoutes from "./routes/thread.routes";
import replyRoutes from "./routes/reply.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());

// CORS configuration: allow production domains and handle preflight requests
const whitelist = [
   "https://farandulacordobesa.com.ar",
   "https://www.farandulacordobesa.com.ar",
];

app.use(
   cors({
      origin: (origin, callback) => {
         // allow requests with no origin (e.g. mobile apps, Postman)
         if (!origin) return callback(null, true);
         if (whitelist.includes(origin)) {
            return callback(null, true);
         }
         callback(new Error("CORS policy: Origin not allowed"));
      },
      credentials: true,
   })
);

// Handle preflight OPTIONS requests
app.options(
   /.*/,
   cors({
      origin: (origin, callback) => {
         if (!origin || whitelist.includes(origin)) {
            return callback(null, true);
         }
         callback(new Error("CORS preflight: Origin not allowed"));
      },
      credentials: true,
   })
);

mongoose
   .connect(process.env.MONGO_URI!)
   .then(() => {
      console.log("Connected to MongoDB");
   })
   .catch((error) => {
      console.error("MongoDB connection error:", error);
   });

app.use("/villages", villageRoutes);
app.use("/threads", threadsRoutes);
app.use("/replies", replyRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
