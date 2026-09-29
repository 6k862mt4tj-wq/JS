// constants/errors.js

export const APP_ERRORS = {
  
  VALIDATION_ERROR: {
    status: 400,
    type: "VALIDATION_ERROR"
  },
  EXPIRED_PRODUCT: {
    status: 400,
    type: "EXPIRED_PRODUCT",
    message: "Срок годности продукта истек, добавление невозможно."
  },
  PRODUCT_NOT_FOUND: {
    status: 404,
    type: "PRODUCT_NOT_FOUND"
  },
  FORBIDDEN_GUEST: {
    status: 403,
    type: "FORBIDDEN",
    message: "Гостевой доступ ограничен только просмотром."
  },
  FORBIDDEN_AI: {
    status: 403,
    type: "FORBIDDEN",
    message: "Гостевой доступ не позволяет использовать AI Шеф-повара. Требуются права USER или ADMIN."
  },
  PAYLOAD_TOO_LARGE: {
    status: 413,
    type: "PAYLOAD_TOO_LARGE",
    message: "Превышен лимит в 1МБ"
  },
  INVALID_JSON: {
    status: 400,
    type: "INVALID_JSON",
    message: "Некорректный формат JSON"
  },
  METHOD_NOT_ALLOWED: {
    status: 405,
    type: "METHOD_NOT_ALLOWED",
    message: "Метод не разрешен"
  },

  AI_CONFIG_ERROR: {
    status: 500,
    type: "AI_CONFIG_ERROR",
    message: "API ключ для нейросети не настроен.",
    isPublic: false
  },
  AI_SERVICE_UNAVAILABLE: {
    status: 502,
    type: "AI_SERVICE_UNAVAILABLE",
    message: "Нейросеть временно недоступна.",
    isPublic: true 
  },
  DATABASE_ERROR: {
    status: 500,
    type: "DATABASE_ERROR",
    message: "Критическая ошибка: недоступна база данных.",
    isPublic: false
  },
  NETWORK_ERROR: {
    status: 500,
    type: "NETWORK_ERROR",
    message: "Соединение было внезапно разорвано клиентом.",
    isPublic: false
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    type: "INTERNAL_SERVER_ERROR",
    message: "Неизвестная внутренняя ошибка сервера.",
    isPublic: false
  }
};
