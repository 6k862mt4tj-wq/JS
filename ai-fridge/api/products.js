// api/products.js

import { readJson } from "../utils/requestParser.js";
import { handleError } from "../utils/errorHandler.js";
import { validateData } from "../services/validService.js";
import { ROLES } from "../config.js";
import { APP_ERRORS } from "../constants/errors.js";
import { AppError } from "../utils/appError.js";
import { getAuthenticatedUser } from "../services/authService.js";
import { fridge, saveFridgeData } from "../data/db.js";
import { 
  findProductIndex, 
  addOrUpdateProduct, 
  removeProduct, 
  addBatchProducts 
} from "../services/arrayService.js";

export async function handleProductsApi(req, res) {
  try {
    
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify(fridge));
    }

    if (req.method === "POST") {
      
      const rawBody = await readJson(req);
      const user = getAuthenticatedUser(rawBody.username);

      if (user.role === ROLES.GUEST) {
        throw new AppError(
          APP_ERRORS.FORBIDDEN_GUEST, 
          `Пользователь "${rawBody.username}" (GUEST) может только просматривать данные.`
        );
      }

      if (rawBody.action === "batch_add") {
        if (!rawBody.items || typeof rawBody.items !== 'object') {
          throw new AppError(APP_ERRORS.VALIDATION_ERROR, "Ожидался объект items со списком ингредиентов.");
        }

        const defaultExpDate = new Date();
        defaultExpDate.setDate(defaultExpDate.getDate() + 7);
        const expDateString = defaultExpDate.toISOString().split('T')[0];

        addBatchProducts(fridge, rawBody.items, expDateString);
        await saveFridgeData();

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        return res.end(JSON.stringify({ message: "Список ингредиентов от Шефа успешно добавлен в холодильник!" }));
      }

      const cleanData = validateData("product", rawBody);
      const { name, count, price, expDate } = cleanData;
      const idx = findProductIndex(fridge, name, expDate);

      if (count === 0) {
        if (idx === -1) {
          throw new AppError(APP_ERRORS.PRODUCT_NOT_FOUND, `Продукт "${name}" не найден в холодильнике.`);
        }
        
        removeProduct(fridge, idx);
        await saveFridgeData(); 
        
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        return res.end(JSON.stringify({ message: `Продукт "${name}" успешно удален.` }));
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (new Date(expDate) < today) {
        throw new AppError(APP_ERRORS.EXPIRED_PRODUCT, `Нельзя добавить просроченный продукт (годен до ${expDate}).`);
      }

      addOrUpdateProduct(fridge, idx, name, count, price, expDate);
      await saveFridgeData(); 

      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify({ message: `Продукт "${name}" сохранен.` }));
    }

    throw new AppError(APP_ERRORS.METHOD_NOT_ALLOWED);

  } catch (error) {
    return handleError(res, error);
  }
}