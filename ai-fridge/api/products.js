// api/products.js

import { readJson } from "../utils/requestParser.js";
import { handleError } from "../utils/errorHandler.js";
import { validateData } from "../services/validService.js";
import { ROLES } from "../config.js";
import { APP_ERRORS } from "../constants/errors.js";
import { AppError } from "../utils/appError.js";
import { getAuthenticatedUser } from "../services/authService.js";
import { getAllProducts, processProductData } from "../services/productService.js";

export async function handleProductsApi(req, res) {
  try {
   
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify(getAllProducts()));
    }

    if (req.method === "POST") {
      const rawBody = await readJson(req);
      const user = getAuthenticatedUser(rawBody.username);
      
      if (user.role === ROLES.GUEST) {
        throw new AppError(APP_ERRORS.FORBIDDEN_GUEST, "Гости могут только просматривать данные.");
      }

      const cleanData = validateData("product", rawBody);
      const successMessage = await processProductData(cleanData);
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify({ message: successMessage }));
    }

    throw new AppError(APP_ERRORS.METHOD_NOT_ALLOWED);
  } catch (error) {
    return handleError(res, error);
  }
}