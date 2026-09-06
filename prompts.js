// npm install @inquirer/prompts

//Запрос данных от пользователя
// 1. Установка расширения под VS Code: Inquirer Prompts , 
// vscode.window.showInputBox
// 2. Использование системных модальных окон ОС для ввода 
// данных поверх всех окон операционной системы  dialog-node.
// 3. Интерактивный ввод данных в консоли Node.js - внутри 
// вкладки терминала VS Code, в терминале ОС, 
// в терминале IDE WebStorm и т.д. - Inquirer Prompts.

import { input, select , confirm, password } from "@inquirer/prompts";

async function runCli() {
    try {
        // 1. Текстовое поле с дефолтным значением
        const name = await input({ message: "Введите ваше имя:" ,
            default : "Аноним" });         

        // 2. Поле с выбором из списка
        const color = await select({
            message: "Выберите ваш любимый цвет:",
            choices: ["Красный", "Зеленый", "Синий"],
        });

        const role = await select({
            message: "Выберите вашу роль:",
            choices: [
                { name: "Администратор", value: "admin" },
                { name: "Пользователь", value: "user" },
                { name: "Гость", value: "guest" }
            ],
        });

        // 3. Поле для ввода пароля (скрытый ввод)
        const apiPassword = await password({
            message: "Введите ваш пароль:",
            mask: "*",
        });

        // 4. Поле с подтверждением (да/нет)
        const isConfirmed = await confirm({
            message: "Вы уверены, что хотите продолжить?",
        });

        

        // Вывод введенных данных
        console.log("Имя:", name);
        console.log("Любимый цвет:", color);
        console.log("Роль:", role);
        console.log("Подтверждено:", isConfirmed);
        console.log("Пароль:", apiPassword);

    } catch (error) {
        console.error("Ошибка при вводе данных:", error);
        console.log("Пожалуйста, попробуйте снова.");
    }
}

runCli();

 