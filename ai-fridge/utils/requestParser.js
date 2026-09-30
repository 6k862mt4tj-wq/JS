// utils/requestParser.js

import { AppError } from "./appError.js";
import { APP_ERRORS } from "../constants/errors.js";

export async function readJson(req, limit = 1024 * 1024) {
  let body = "";
  let bytes = 0;
  
  try {
    for await (const chunk of req) {
      bytes += chunk.length;
      
      if (bytes > limit) {
        throw new AppError(APP_ERRORS.PAYLOAD_TOO_LARGE);
      }
      
      body += chunk; 
    }
    
    return body ? JSON.parse(body) : {};
    
  } catch (err) {
    
    if (err instanceof AppError) {
      throw err;
    }

    if (err instanceof SyntaxError) {
      throw new AppError(APP_ERRORS.INVALID_JSON);
    }
    
    throw err;
  }
}