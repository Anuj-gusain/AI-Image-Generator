import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE FIRST


import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./route/authroute.js";
import imageRoutes from "./route/imageroute.js";

const app = express();
app.set("trust proxy", true);

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});