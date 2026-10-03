// services/arrayService.js

export function normalizeName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[(),.]/g, '')
    .split(/\s+/)
    .sort()
    .join(" ");
}

export function findProductIndex(fridge, name, expDate) {
  const normalizedInput = normalizeName(name);
  return fridge.findIndex(
    (p) => normalizeName(p.name) === normalizedInput && p.expDate === expDate
  );
}

export function addOrUpdateProduct(fridge, idx, name, count, price, expDate) {
  const finalName = normalizeName(name);

  if (idx !== -1) {
    fridge[idx].name = finalName; 
    fridge[idx].count += count;
    fridge[idx].price = price;
  } else {
    fridge.push({ name: finalName, count, price, expDate });
  }
}

export function removeProduct(fridge, idx) {
  if (idx !== -1) fridge.splice(idx, 1);
}