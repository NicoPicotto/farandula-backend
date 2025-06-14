const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/villages", require("./routes/village.routes"));
app.use("/api/threads", require("./routes/thread.routes"));
app.use("/api/replies", require("./routes/reply.routes"));
app.use("/api/auth", require("./routes/auth.routes"));

// DB + Server
mongoose
   .connect(process.env.MONGO_URI)
   .then(() => {
      console.log("MongoDB connected");
      app.listen(3000, () =>
         console.log("Server running on http://localhost:3000")
      );
   })
   .catch((err) => console.error(err));
