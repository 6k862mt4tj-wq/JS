// services/arrayService.js

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

export function getTotalProductCount(fridge, name) {
  const nameLower = name.toLowerCase();
  return fridge
    .filter((p) => p.name.toLowerCase() === nameLower)
    .reduce((sum, p) => sum + p.count, 0); 
}

export function addBatchProducts(fridge, items, expDate) {
  for (const [name, rawCount] of Object.entries(items)) {
    
    const requiredCount = Number(rawCount);
    if (Number.isNaN(requiredCount) || requiredCount <= 0) {
      continue;
    }
    
    const currentTotal = getTotalProductCount(fridge, name);

    if (currentTotal < requiredCount) {
      
      const missingCount = requiredCount - currentTotal;
      
      const idx = findProductIndex(fridge, name, expDate);

      if (idx !== -1) {
   
        const newTotalForThisDate = fridge[idx].count + missingCount;
        addOrUpdateProduct(fridge, idx, name, newTotalForThisDate, fridge[idx].price, expDate);
      } else {
        
        addOrUpdateProduct(fridge, idx, name, missingCount, 0, expDate);
      }
    }
  }
}