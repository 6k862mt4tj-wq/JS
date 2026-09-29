// services/aiService.js

import { GoogleGenAI } from "@google/genai";
import { AI_MODEL, apiKey } from "../config.js";
import { APP_ERRORS } from "../constants/errors.js";
import { AppError } from "../utils/appError.js";
import { createBasePromptByRole, createPrompt } from "./promptService.js";

const aiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function askAi(user, dishTitle, fridgeData) {
    if (!aiClient) {
        throw new AppError(APP_ERRORS.AI_CONFIG_ERROR, "API ключ для ИИ не настроен.");
    }
    
    const basePrompt = createBasePromptByRole(user);
    const finalPrompt = createPrompt(basePrompt, dishTitle, fridgeData);

    try {
        const response = await aiClient.models.generateContent({
            model: AI_MODEL,
            contents: finalPrompt,
        });
        return response.text;
    } catch (error) {
        const appErr = new AppError(APP_ERRORS.AI_SERVICE_UNAVAILABLE, "Нейросеть временно недоступна.");
        appErr.originalError = error;
        throw appErr;
    }
}

export function parseAiResponse(aiText) {
  try {
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = aiText.match(jsonRegex);

    let ingredients = {};

    if (match && match[1]) {
      
      ingredients = JSON.parse(match[1]);
    } 

    else {
      const startIndex = aiText.indexOf('{');
      const endIndex = aiText.lastIndexOf('}');
      
      if (startIndex !== -1 && endIndex !== -1) {
        const rawJson = aiText.substring(startIndex, endIndex + 1);

        ingredients = JSON.parse(rawJson);
      }
    }

    return {
      recipe: aiText,
      ingredients: ingredients
    };

  } catch (error) {
    console.error("[AI Parser] Ошибка извлечения JSON:", error);
    return {
      recipe: aiText,
      ingredients: {} 
    };
  }
}