export function normalizeProductName(productName) {
    return productName.trim().toLowerCase();
}

export function hasProduct(productName, productsToCheck) {
    const normalizedName =
        normalizeProductName(productName);

    return productsToCheck.some(
        product =>
            normalizeProductName(product.name) ===
            normalizedName
    );
}

export { getCurrentProducts } from "./products.js";
