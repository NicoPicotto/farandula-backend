import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import villageRoutes from "./routes/village.routes";
import threadsRoutes from "./routes/thread.routes";
import replyRoutes from "./routes/reply.routes";

dotenv.config();
const app = express();

app.use(express.json());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
