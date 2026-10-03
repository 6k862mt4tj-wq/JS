// services/productService.js

import { fridge, saveFridgeData } from "../data/db.js";
import { findProductIndex, addOrUpdateProduct, removeProduct } from "./arrayService.js";
import { AppError } from "../utils/appError.js";
import { APP_ERRORS } from "../constants/errors.js";

export function getAllProducts() {
  return fridge;
}

export async function processProductData(cleanData) {
  const { name, count, price, expDate } = cleanData;
  const idx = findProductIndex(fridge, name, expDate);

  if (count === 0) {
    if (idx === -1) {
      throw new AppError(APP_ERRORS.PRODUCT_NOT_FOUND, `Продукт "${name}" не найден.`);
    }
    removeProduct(fridge, idx);
    await saveFridgeData(); 
    return `Продукт "${name}" удален.`; 
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDateObj = new Date(expDate + "T00:00:00");
  if (expDateObj < today) {
    throw new AppError(APP_ERRORS.EXPIRED_PRODUCT, `Продукт просрочен (годен до ${expDate}).`);
  }

  addOrUpdateProduct(fridge, idx, name, count, price, expDate);
  await saveFridgeData(); 
  return `Продукт "${name}" сохранен.`;
}