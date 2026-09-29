// services/promptService.js

import { ROLES } from "../config.js";

export function createBasePromptByRole(user) {
    if (user.role === ROLES.ADMIN) {
        return `На основе названия блюда и списка продуктов в холодильнике, дай полный классический рецепт блюда и подробно опиши какие недостающие продукты нужно докупить. 
        Верни список ингредиентов строго в формате JSON, где ключ — это название продукта (с большой буквы), а значение — количество (число).`;
    }
    
    if (user.role === ROLES.USER) {
        return `На основе названия блюда и списка продуктов в холодильнике, составь рецепт блюда, либо дай альтернативу блюду, если не хватает продуктов.`; 
    }
    
    return `На основе названия блюда, составь рецепт блюда. Учитывать продукты из холодильника не обязательно.`;
}

export function createPrompt(basePrompt, dishTitle, products) {
    
    const productsList = products.length > 0 
        ? products.map(p => `- ${p.name} (${p.count} шт., годен до ${p.expDate})`).join('\n')
        : "Холодильник пуст.";

    return `${basePrompt}\n\nЖелаемое блюдо: ${dishTitle}\n\nПродукты в холодильнике:\n${productsList}`;
}