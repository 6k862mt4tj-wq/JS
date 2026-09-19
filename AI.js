import axios from "axios";
import { GoogleGenAI } from "@google/genai";

 
async function askAi(prompt) {
  const genAi = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });
 
  const response = await genAi.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
 
  return response.text;
}
 
async function main() {
  const prompt =
    "Write a short story about a robot learning to play the piano.";
 
  const aiResponse = await askAi(prompt);
 
  console.log("AI Response:", aiResponse);
}
 
main();
 
