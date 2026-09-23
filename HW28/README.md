# HW28 — учебный frontend-only вариант

## Запуск

1. Откройте `secret.js` и вставьте свой Gemini API key:

```js
export const GEMINI_API_KEY = "YOUR_KEY";
```

2. Откройте `index.html` через встроенный web-server WebStorm (`Open in Browser`).

3. Для проверки можно использовать:
   - `Bill` — роль `ADMIN`;
   - `John` — роль `USER`;
   - блюдо: `борщ`.

## Важно

Это учебная frontend-only версия. Ключ не коммитится в Git благодаря `.gitignore`, но браузер всё равно может увидеть его в DevTools. В production секретный API key должен храниться на backend.

Node.js, npm, `dotenv` и `@google/genai` для запуска этой версии не нужны.
