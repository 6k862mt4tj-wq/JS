import {hasProduct} from "./utils.js";

export const products = [
    {
        id: 1,
        name: "Молоко",
        category: "Молочные продукты",
        bought: false
    },
    {
        id: 2,
        name: "Хлеб",
        category: "Выпечка",
        bought: true
    },
    {
        id: 3,
        name: "Сыр",
        category: "Молочные продукты",
        bought: false
    },
    {
        id: 4,
        name: "Яблоки",
        category: "Фрукты",
        bought: false
    }
];

export let draftProducts = null;

export function getCurrentProducts() {
    return draftProducts ?? products;
}

export function isDraftMode() {
    return draftProducts !== null;
}
export function toggleProduct(id) {
    const product = getCurrentProducts().find(
        product => product.id === id
    );

    if (!product) {
        return;
    }
    product.bought = !product.bought;
}



export function createDraft() {
    if (draftProducts !== null) {
        return;
    }
    draftProducts = structuredClone(products);

}

export function saveDraft() {
    if (!draftProducts) {
        return;
    }

    products.splice(
        0,
        products.length,
        ...draftProducts
    );

    draftProducts = null;

}
export function cancelDraft() {
    if (!draftProducts) {
        return;
    }

    draftProducts = null;

}

export function addProduct(name, category) {
    const cleanName = name.trim();
    const cleanCategory = category.trim();

    if (!cleanName || !cleanCategory) {
        return false;
    }

    const currentProducts = getCurrentProducts();

    if (hasProduct(cleanName, currentProducts)) {
        return false;
    }

    const maxId = currentProducts.reduce((max, p) => Math.max(max, p.id), 0);
    const newProduct = {
        id: maxId + 1,
        name: cleanName,
        category: cleanCategory,
        bought: false
    };

    currentProducts.push(newProduct);
    return true;
}