import express from "express";
import { generateImage } from "../controller/imagecontroller.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/generate", protect,generateImage);

export default router;