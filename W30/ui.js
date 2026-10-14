export function createUI(app) {
    const title = document.createElement("h1");
    title.textContent = "Список продуктов";

    const form = document.createElement("form");

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Введите продукт";

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.placeholder = "Категория";

    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Добавить";

    const message = document.createElement("p");
    message.className = "message";

    form.append(input, categoryInput, button, message);

    const modePanel = document.createElement("div");
    modePanel.className = "mode-panel";

    const modeTitle = document.createElement("h2");
    modeTitle.textContent = "Основной список";

    const modeText = document.createElement("p");
    modeText.textContent = "Актуальное состояние списка продуктов.";

    modePanel.append(modeTitle, modeText);

    const filterAllButton = document.createElement("button");
    filterAllButton.type = "button";
    filterAllButton.textContent = "Все";
    filterAllButton.classList.add("active");

    const filterNeedButton = document.createElement("button");
    filterNeedButton.type = "button";
    filterNeedButton.textContent = "Нужно купить";

    const filterBoughtButton = document.createElement("button");
    filterBoughtButton.type = "button";
    filterBoughtButton.textContent = "Куплено";

    const filters = document.createElement("div");
    filters.className = "filters";
    filters.append(
        filterAllButton,
        filterNeedButton,
        filterBoughtButton
    );

    const hint = document.createElement("div");
    hint.className = "hint";
    hint.textContent = "Нажмите на продукт, чтобы отметить его как купленный";

    const list = document.createElement("ul");

    const createDraftButton = document.createElement("button");
    createDraftButton.type = "button";
    createDraftButton.textContent = "Создать черновик";

    const saveDraftButton = document.createElement("button");
    saveDraftButton.type = "button";
    saveDraftButton.textContent = "Сохранить изменения";
    saveDraftButton.disabled = true;

    const cancelDraftButton = document.createElement("button");
    cancelDraftButton.type = "button";
    cancelDraftButton.textContent = "Отменить изменения";
    cancelDraftButton.disabled = true;

    const actions = document.createElement("div");
    actions.className = "actions";
    actions.append(
        createDraftButton,
        saveDraftButton,
        cancelDraftButton
    );

    app.append(
        title,
        form,
        modePanel,
        filters,
        hint,
        list,
        actions
    );

    return {
        app,
        form,
        input,
        categoryInput,
        button,
        message,
        modePanel,
        modeTitle,
        modeText,
        filters,
        filterAllButton,
        filterNeedButton,
        filterBoughtButton,
        hint,
        list,
        actions,
        createDraftButton,
        saveDraftButton,
        cancelDraftButton
    };
}

export function updateMode(isDraft, elements) {
    if (!elements) return;

    const {
        app,
        modeTitle,
        modeText,
        createDraftButton,
        saveDraftButton,
        cancelDraftButton
    } = elements;

    if (isDraft) {
        app.classList.add("draft-mode");
        modeTitle.textContent = "Черновик";
        modeText.textContent = "Режим редактирования черновика. Изменения не сохранены в основной список.";
        createDraftButton.disabled = true;
        saveDraftButton.disabled = false;
        cancelDraftButton.disabled = false;
    } else {
        app.classList.remove("draft-mode");
        modeTitle.textContent = "Основной список";
        modeText.textContent = "Актуальное состояние списка продуктов.";
        createDraftButton.disabled = false;
        saveDraftButton.disabled = true;
        cancelDraftButton.disabled = true;
    }
}

export function renderProducts(productsToRender, list) {
    list.replaceChildren();

    if (productsToRender.length === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.className = "empty";
        emptyLi.textContent = "Продукты не найдены";
        list.append(emptyLi);
        return;
    }

    productsToRender.forEach(product => {
        const li = document.createElement("li");
        li.dataset.id = product.id;

        const textSpan = document.createElement("span");
        textSpan.className = "product-text";
        textSpan.textContent = `${product.name} — ${product.category}`;
        li.append(textSpan);

        if (product.bought) {
            li.classList.add("bought");
        }

        const infoButton = document.createElement("button");
        infoButton.type = "button";
        infoButton.className = "info-btn";
        infoButton.textContent = "Show information";
        infoButton.dataset.id = product.id;
        li.append(infoButton);

        list.append(li);
    });
}