// config.js

import path from "node:path";

export const ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    GUEST: 'GUEST',
};

export const apiKey = process.env.GEMINI_API_KEY;
export const PORT = process.env.PORT || 3000;
export const AI_MODEL = "gemini-3-flash-preview";

const ROOT_DIR = process.cwd();

// Папки
export const DATA_DIR = path.join(ROOT_DIR, "data");
export const PUBLIC_DIR = path.join(ROOT_DIR, "public");

// Файлы
export const JSON_FILE = path.join(DATA_DIR, "fridge.json");
export const CSV_FILE = path.join(DATA_DIR, "fridge.csv");
export const INDEX_PATH = path.join(PUBLIC_DIR, "index.html");