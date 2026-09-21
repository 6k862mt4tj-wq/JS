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

const schemas = [
  {
    $id: "name",
    type: "string",
    minLength: 1,
    pattern: "^[a-zA-Zа-яА-ЯёЁ0-9\\s\\-]+$"
  },
  {
    $id: "number",
    type: "number",
    minimum: 0
  },
  {
    $id: "date",
    type: "string",
    format: "real-date"
  },
  {
    $id: "product",
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
  }
];

schemas.forEach(schema => ajv.addSchema(schema));

function sanitizeData(data) {
  if (typeof data === "string") {
    return data.trim().replace(/\s+/g, " ");
  }
  
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    const cleanedObj = { ...data }; 
    if (typeof cleanedObj.name === "string") {
      cleanedObj.name = cleanedObj.name.trim().replace(/\s+/g, " ");
    }
    if (typeof cleanedObj.username === "string") {
      cleanedObj.username = cleanedObj.username.trim();
    }
    return cleanedObj;
  }
  
  return data;
}

export function validateData(schemaName, rawData) {
  const cleanData = sanitizeData(rawData);
  const isValid = ajv.validate(schemaName, cleanData);

  return isValid 
    ? { isValid: true, data: cleanData } 
    : { isValid: false, errorMessage: ajv.errorsText(ajv.errors, { separator: "; ", dataVar: "Field" }) };
}