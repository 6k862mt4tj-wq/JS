// utils/appError.js

export class AppError extends Error {
  constructor(errorConfig, customMessage) {
    super(customMessage || errorConfig.message || "Произошла ошибка");
    this.status = errorConfig.status || 500;
    this.type = errorConfig.type || "UNKNOWN_ERROR";
    
    if (errorConfig.isPublic !== undefined) {
      this.isPublic = errorConfig.isPublic;
    } else {
      this.isPublic = this.status < 500;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}
