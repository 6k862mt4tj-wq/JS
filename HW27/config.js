import path from "node:path";

export const ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    GUEST: 'GUEST',
};

export const apiKey = process.env.GEMINI_API_KEY;
export const PORT = process.env.PORT || 3000;
export const AI_MODEL = "gemini-3-flash-preview";
export const JSON_FILE = path.resolve("fridge.json");
export const CSV_FILE = path.resolve("fridge.csv");
export const INDEX_PATH = path.resolve("index.html");