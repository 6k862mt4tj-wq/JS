// utils/errorHandler.js

import { AppError } from "./appError.js";
import { APP_ERRORS } from "../constants/errors.js";

export function handleError(res, error) {
  let appError = error;

  if (!(error instanceof AppError)) {
    const nativeType = error.code || error.name;
    let errorConfig = APP_ERRORS.INTERNAL_SERVER_ERROR;

    if (nativeType === "SyntaxError") errorConfig = APP_ERRORS.INVALID_JSON;
    else if (nativeType === "ENOENT") errorConfig = APP_ERRORS.DATABASE_ERROR;
    else if (nativeType === "ECONNRESET") errorConfig = APP_ERRORS.NETWORK_ERROR;

    appError = new AppError(errorConfig);
    appError.originalError = error; 
  }

  if (appError.status >= 500) {
    console.error(`[ERROR] ${appError.type}:`, appError.originalError || error);
  }

  const responseData = {
    error: {
      type: appError.isPublic ? appError.type : "INTERNAL_SERVER_ERROR",
      message: appError.isPublic ? appError.message : "Произошла внутренняя ошибка сервера."
    }
  };

  res.statusCode = appError.status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  
  if (appError.status === 413) {
    res.setHeader("Connection", "close");
  }
  
  res.end(JSON.stringify(responseData));
}