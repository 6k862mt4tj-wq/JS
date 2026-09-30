ai-fridge/
│
├── api/                    # КОНТРОЛЛЕРЫ: 
│   ├── products.js         # Обработка GET/POST для /api/products
│   └── recipe.js           # Обработка POST для /api/recipe
│
├── constants/              # КОНСТАНТЫ: 
│   ├── errors.js           # Словарь ошибок
│
├── services/               # СЕРВИСЫ:  
│   ├── aiService.js        # Запросы к нейросети и парсер ответа
│   ├── promptService.js    # Создание промптов для каждого пользователя 
│   ├── authService.js      # Проверка прав доступа (роли GUEST, USER и т.д.)
│   ├── fileService.js      # Запись в CSV, JSON, чтение HTML-шаблонов
│   ├── arrayService.js     # Изменения в массиве продуктов
│   └── validService.js     # Ajv и схемы валидации
│
├── utils/                  # УТИЛИТЫ:
│   ├── appError.js         # Универсальный класс ошибок
│   └── errorHandler.js     # Центральный обработчик ошибок
│   └── requestParser.js    # Парсеры потоков
│
├── data/                   # БАЗА ДАННЫХ:
│   ├── db.js               # Модуль загрузки в память и сохранения на диск
│   └── fridge.json         # JSON-файл (физическое хранилище)
│
├── public/                 # Фронтенд:
│   ├── index.html          # HTML
│   ├── style.css           # Стили
│   └── FRIDGE.jpg          # Изображения
│
├── config.js               # КОНФИГ: Порт, пути к файлам, константы ролей
├── router.js               # МАРШРУТИЗАТОР: Разводка URL адресов по контроллерам
├── main.js                 # ТОЧКА ВХОДА: Инициализация сервера (http.createServer)
│
├── package.json            # Список зависимостей
└── .env                    # Секретные ключи