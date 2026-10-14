import {
    addProduct,
    cancelDraft,
    createDraft,
    getCurrentProducts,
    isDraftMode,
    saveDraft,
    toggleProduct
} from "./products.js";

import { createUI, renderProducts, updateMode } from "./ui.js";

const app = document.querySelector("#app");

const uiElements = createUI(app);

const {
    form,
    input,
    categoryInput,
    message,
    list,
    filterAllButton,
    filterNeedButton,
    filterBoughtButton,
    createDraftButton,
    saveDraftButton,
    cancelDraftButton
} = uiElements;

let activeFilter = "all";

function updateFilterButtons() {
    filterAllButton.classList.toggle("active", activeFilter === "all");
    filterNeedButton.classList.toggle("active", activeFilter === "need");
    filterBoughtButton.classList.toggle("active", activeFilter === "bought");
}

function render() {
    updateMode(isDraftMode(), uiElements);

    const currentProducts = getCurrentProducts();
    let visibleProducts = currentProducts;

    if (activeFilter === "need") {
        visibleProducts = currentProducts.filter(product => !product.bought);
    } else if (activeFilter === "bought") {
        visibleProducts = currentProducts.filter(product => product.bought);
    }

    updateFilterButtons();
    renderProducts(visibleProducts, list);
}

filterAllButton.addEventListener("click", () => {
    activeFilter = "all";
    render();
});

filterNeedButton.addEventListener("click", () => {
    activeFilter = "need";
    render();
});

filterBoughtButton.addEventListener("click", () => {
    activeFilter = "bought";
    render();
});

list.addEventListener("click", (event) => {
    
    const infoButton = event.target.closest(".info-btn");
    if (infoButton) {
        const id = Number(infoButton.dataset.id || infoButton.closest("li")?.dataset.id);
        const currentProducts = getCurrentProducts();
        const product = currentProducts.find(p => p.id === id);

        if (product) {
            const status = product.bought ? "Куплено" : "Нужно купить";
            alert(`Название: ${product.name}\nКатегория: ${product.category}\nСтатус: ${status}`);
        }
        return;
    }

    const li = event.target.closest("li:not(.empty)");
    if (!li || !list.contains(li)) {
        return;
    }

    const id = Number(li.dataset.id);
    toggleProduct(id);
    render();
});

function handleSubmit(e) {
    e.preventDefault();
    const productName = input.value.trim();
    const category = categoryInput.value.trim();

    if (!productName || !category) {
        message.textContent = "Пожалуйста, заполните оба поля!";
        return;
    }

    const added = addProduct(productName, category);
    if (!added) {
        message.textContent = "Такой продукт уже есть в списке!";
        return;
    }

    message.textContent = "";
    input.value = "";
    categoryInput.value = "";
    input.focus();
    render();
}

input.addEventListener("input", () => {
    if (message.textContent) message.textContent = "";
});
categoryInput.addEventListener("input", () => {
    if (message.textContent) message.textContent = "";
});

form.addEventListener("submit", handleSubmit);

createDraftButton.addEventListener("click", () => {
    createDraft();
    render();
});

saveDraftButton.addEventListener("click", () => {
    saveDraft();
    render();
});

cancelDraftButton.addEventListener("click", () => {
    cancelDraft();
    render();
});

render();