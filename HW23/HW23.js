/*
HW_23_TEXT
1.Из полученного ответа извлеките 
и распечатайте данные про коды ответа и их расшифровку.
2*** Подсчитайте, сколько раз в ответе упоминаются методы REST (GET, POST и т.д.).
и распечатайте результат. Используйте методы строк и массивов.
*/

import axios from "axios";
import { GoogleGenAI } from "@google/genai";

async function askAi(prompt) {
  const genAi = new GoogleGenAI({
    apiKey: process.env.API_KEY
  });

  const response = await genAi.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
}

async function main() {
  const prompt = "Напиши что такое REST API и как его использовать в JavaScript, дай все коды ответов сервера и их расшифровку, а также все методы REST";

  const aiResponse = await askAi(prompt);

  console.log("AI Response:", typeof aiResponse === "string" ? aiResponse : JSON.stringify(aiResponse));

  const cleanResponse = aiResponse.replace(/[*#`_]/g, '');

  const codeResponse = cleanResponse.match(/\b[1-5]\d{2}\b[^—\n-]*[-—].*/g) || [];

  const restMethods = cleanResponse.match(/\b(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS|TRACE|CONNECT)\b/g) || [];

  console.log("\nКоды ответов сервера:\n", codeResponse);
  console.log("\nНайденные методы REST:\n", restMethods);
  console.log("\nОбщее количество упоминаний:", restMethods.length);
}

main();