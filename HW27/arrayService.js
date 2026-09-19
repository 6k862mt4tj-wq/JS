export function findProductIndex(fridge, name, expDate) {
  const nameLower = name.toLowerCase();
  return fridge.findIndex(
    (p) => p.name.toLowerCase() === nameLower && p.expDate === expDate
  );
}

export function addOrUpdateProduct(fridge, idx, name, count, price, expDate) {
  if (idx !== -1) {
    fridge[idx].count = count;
    fridge[idx].price = price;
  } else {
    fridge.push({ name, count, price, expDate });
  }
}

export function removeProduct(fridge, idx) {
  if (idx !== -1) fridge.splice(idx, 1);
}