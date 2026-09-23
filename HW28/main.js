import {readFromJsonFile} from "./fileService.js";
import {getUserByName} from "./authService.js";
import {FRIDGE_FILE, USERS_FILE, ROLES} from "./config.js";
import {createBasePromptByRole, createPrompt} from "./promptService.js";
import {askAi} from "./aiService.js";

// Элементы модального окна для ошибок
const errorModal = document.getElementById("errorModal");
const errorMessage = document.getElementById("errorMessage");
const closeModal = document.getElementById("closeModal");

closeModal.addEventListener("click", () => {
    errorModal.close();
});

// Элементы системного модального окна
const systemModal = document.getElementById("systemModal");
const systemModalTitle = document.getElementById("systemModalTitle");
const systemModalMessage = document.getElementById("systemModalMessage");
const closeSystemModal = document.getElementById("closeSystemModal");

closeSystemModal.addEventListener("click", () => {
    systemModal.close();
});

function showSystemMessage(title, message) {
    systemModalTitle.textContent = title;
    systemModalMessage.textContent = message;
    systemModal.showModal();
}

let users = [];
let products = [];

try {
    // Убран лишний аргумент
    users = await readFromJsonFile(USERS_FILE);
    products = await readFromJsonFile(FRIDGE_FILE);
} catch (error) {
    showSystemMessage("Системная ошибка", "Не удалось загрузить данные. Убедитесь, что сервер запущен корректно.");
    console.error("Ошибка при загрузке данных:", error);
}

const form = document.getElementById("searchForm");
const userNameInput = document.getElementById("userName");
const dishTitleInput = document.getElementById("dishTitle");
const result = document.getElementById("result");

form.addEventListener("submit", async event => {
    event.preventDefault();
    
    const userName = userNameInput.value.trim();
    const dishTitle = dishTitleInput.value.trim();
    
    try {
        // 1. Сначала валидируем пустые поля
        if (!userName) throw new Error("Укажите имя пользователя");
        if (!dishTitle) throw new Error("Укажите название блюда");

        // 2. Ищем пользователя (если не найден, authService вернет GUEST)
        const authenticatedUser = getUserByName(users, userName);
        
        // Показываем системное сообщение для гостя
        if (authenticatedUser.role === ROLES.GUEST) {
            showSystemMessage("Режим гостя", "Вы вошли как гость. Гостям не доступны сложные блюда — только базовые перекусы.");
        }

        // 3. Формируем промпты
        const basePrompt = createBasePromptByRole(authenticatedUser);
        const finalPrompt = createPrompt(basePrompt, dishTitle, products);
        
        // 4. Состояние загрузки
        result.textContent = "Анализирую данные...";
        
        // 5. Запрос к ИИ
        const answer = await askAi(finalPrompt);
        result.textContent = answer;
    } catch (error) {
        // Выводим ошибки пользователю
        errorMessage.textContent = error.message;
        errorModal.showModal();
        if (result.textContent === "Анализирую данные...") {
            result.textContent = "Здесь появится ответ";
        }
    }
});
