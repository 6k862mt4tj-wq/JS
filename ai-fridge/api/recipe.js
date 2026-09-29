// api/recipe.js

import { readJson } from "../utils/requestParser.js";
import { handleError } from "../utils/errorHandler.js";
import { validateData } from "../services/validService.js";
import { ROLES } from "../config.js";
import { APP_ERRORS } from "../constants/errors.js";
import { AppError } from "../utils/appError.js";
import { getAuthenticatedUser } from "../services/authService.js";
import { askAi, parseAiResponse } from "../services/aiService.js"; 
import { fridge } from "../data/db.js"; 

export async function handleRecipeApi(req, res) {
  try {
   
    if (req.method !== "POST") {
      throw new AppError(APP_ERRORS.METHOD_NOT_ALLOWED);
    }

    const rawBody = await readJson(req);

    const user = getAuthenticatedUser(rawBody.username);
    if (user.role === ROLES.GUEST) {
      
      throw new AppError(APP_ERRORS.FORBIDDEN_GUEST, "Гостям недоступна генерация рецептов.");
    }

    const cleanData = validateData("recipeRequest", rawBody);
    const { dishTitle } = cleanData;
    const rawAiText = await askAi(user, dishTitle, fridge);
    const { recipe, ingredients } = parseAiResponse(rawAiText);

    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    
    return res.end(JSON.stringify({ 
      recipe: recipe, 
      ingredients: ingredients 
    }));

  } catch (error) {
    return handleError(res, error);
  }
}