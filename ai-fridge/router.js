// router.js

import path from "node:path";
import { readFile } from "node:fs/promises";
import { PUBLIC_DIR } from "./config.js";
import { handleProductsApi } from "./api/products.js";
import { handleRecipeApi } from "./api/recipe.js";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
  ".json": "application/json",
  ".ico":  "image/x-icon"
};

export async function requestHandler(req, res) {
  
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;
  
  if (pathname === "/api/products") {
    return handleProductsApi(req, res);
  }

  if (pathname === "/api/recipe") {
    return handleRecipeApi(req, res);
  }
  
  try {
    
    const urlPath = pathname === "/" ? "/index.html" : pathname;
    const filePath = path.join(PUBLIC_DIR, urlPath);
    
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.end(JSON.stringify({ 
        error: { type: "FORBIDDEN", message: "Доступ за пределы директории public запрещен" } 
      }));
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const fileContent = await readFile(filePath);
    
    res.writeHead(200, { "Content-Type": contentType });
    return res.end(fileContent);

  } catch (err) {
    
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify({ 
      error: { 
        type: "NOT_FOUND", 
        message: "Запрашиваемый ресурс или маршрут не найден" 
      } 
    }));
  }
}