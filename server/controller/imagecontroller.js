import Image from "../models/image.js";
import { getGemini } from "../config/gemini.js";

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 🔥 DAILY LIMIT LOGIC
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const userCount = await Image.countDocuments({
      user: req.user._id,
      createdAt: { $gte: todayStart }
    });

    const ip = req.ip;

    const ipCount = await Image.countDocuments({
      ipAddress: ip,
      createdAt: { $gte: todayStart }
    });

    if (userCount >= 3) {
      return res.status(403).json({ error: "Daily image limit reached (User)" });
    }

    if (ipCount >= 3) {
      return res.status(403).json({ error: "Daily image limit reached (IP)" });
    }

    // 🔥 GEMINI GENERATION
    const genAI = getGemini();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    if (!result.response?.candidates?.length) {
      return res.status(500).json({ error: "No candidates returned" });
    }

    const parts = result.response.candidates[0].content.parts;

    const imagePart = parts.find((p) => p.inlineData);

    if (!imagePart) {
      return res.status(500).json({ error: "No image returned" });
    }

    const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

    // 🔥 SAVE IMAGE WITH IP
    const savedImage = await Image.create({
      user: req.user._id,
      prompt,
      imageUrl,
      ipAddress: ip,
    });

    return res.status(201).json(savedImage);

  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Unknown error"
    });
  }
};