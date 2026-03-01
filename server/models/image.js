import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    prompt: String,
    imageUrl: String,
    ipAddress: String, // ✅ added
  },
  { timestamps: true }
);

export default mongoose.model("Image", imageSchema);