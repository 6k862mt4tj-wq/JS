import { GoogleGenAI } from "@google/genai";
import { AI_MODEL } from "./config.js";
import { apiKey } from "./config.js";

export async function askAi(prompt) {
    
    if (!apiKey) {
        throw new Error('API ключ не найден. Установите переменную окружения GEMINI_API_KEY.');
    }
    
    const genAi = new GoogleGenAI({ apiKey });

    try {
        const response = await genAi.models.generateContent({
            model: AI_MODEL,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Ошибка AI:", error);
        throw new Error("Не удалось получить ответ от нейросети.");
    }
}