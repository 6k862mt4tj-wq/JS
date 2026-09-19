import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

ajv.addFormat("real-date", {
  type: "string",
  validate: (dateString) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return false;
    return date.toISOString().startsWith(dateString);
  }
});
 
const checkName = ajv.compile({ type: "string", minLength: 1, pattern: "^[a-zA-Zа-яА-ЯёЁ0-9\\s\\-]+$" });
const checkNumber = ajv.compile({ type: "number", minimum: 0 });
const checkDate = ajv.compile({ type: "string", format: "real-date" });
const checkProduct = ajv.compile({
  type: "object",
  properties: {
    username: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1, pattern: "^[a-zA-Zа-яА-ЯёЁ0-9\\s\\-]+$" },
    count: { type: "number", minimum: 0 },
    price: { type: "number", minimum: 0 },
    expDate: { type: "string", format: "real-date" }
  },
  required: ["name", "count", "price", "expDate"],
  additionalProperties: false
});
 
function getErrorMessage(errors, defaultMsg) {
  if (!errors) return defaultMsg;
  const err = errors[0];
  if (err.keyword === "pattern") return "Содержит недопустимые символы (разрешены буквы, цифры, дефис, пробел).";
  if (err.keyword === "format") return "Неверный формат или несуществующая дата (YYYY-MM-DD).";
  if (err.keyword === "minimum") return "Значение не может быть отрицательным.";
  return err.message;
}

export function validateName(rawName) {
  const cleanName = typeof rawName === "string" ? rawName.trim().replace(/\s+/g, " ") : rawName;
  const isValid = checkName(cleanName);
  return isValid 
    ? { isValid: true, data: cleanName } 
    : { isValid: false, errorMessage: getErrorMessage(checkName.errors, "Ошибка имени") };
}

export function validateNumber(rawNumber) {
  const isValid = checkNumber(rawNumber);
  return isValid 
    ? { isValid: true, data: rawNumber } 
    : { isValid: false, errorMessage: getErrorMessage(checkNumber.errors, "Введено не число") };
}

export function validateDate(rawDate) {
  const cleanDate = typeof rawDate === "string" ? rawDate.trim() : rawDate;
  const isValid = checkDate(cleanDate);
  return isValid 
    ? { isValid: true, data: cleanDate } 
    : { isValid: false, errorMessage: getErrorMessage(checkDate.errors, "Ошибка даты") };
}
 
export function validateProductObj(rawObj) {
  const dataToValidate = { ...rawObj };
  if (typeof dataToValidate.name === "string") {
    dataToValidate.name = dataToValidate.name.trim().replace(/\s+/g, " ");
  }
  const isValid = checkProduct(dataToValidate);
  return isValid 
    ? { isValid: true, data: dataToValidate } 
    : { isValid: false, errorMessage: "Поврежденные данные объекта" };
}