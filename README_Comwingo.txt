Comwingo Store — вакансия менеджера AliExpress

Структура:
- index.html, vacancy.html, apply.html, how-to-start.html, reviews.html, about.html — страницы сайта.
- style.css, script.js — стили и логика фронтенда.
- /api/apply.js — serverless-функция для Vercel, которая отправляет отклики в Telegram.

Чтобы заявки приходили в Telegram-группу:
1. Создайте бота через @BotFather и получите токен.
2. Создайте группу/канал, добавьте туда бота, получите CHAT_ID.
3. В настройках проекта на Vercel добавьте переменные:
   TELEGRAM_BOT_TOKEN = токен бота
   TELEGRAM_CHAT_ID   = id группы/канала
4. Залейте этот проект на GitHub и подключите к Vercel как Static + Serverless.
5. После деплоя отправка формы /api/apply начнёт слать сообщения в Telegram.
