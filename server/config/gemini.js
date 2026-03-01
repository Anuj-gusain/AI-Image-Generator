import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI;

export const getGemini = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};