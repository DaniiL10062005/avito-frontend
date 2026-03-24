# Avito Frontend

Фронтенд-приложение на `React + TypeScript + Vite` для просмотра, редактирования и фильтрации объявлений.

## Требования

- `Node.js` 20+
- `npm` 10+
- запущенный backend API на `http://localhost:8080`
- для AI-функций: установленный и запущенный `Ollama`

## Переменные окружения

В проекте используется файл `.env`:

```env
VITE_BACKEND_URL='http://localhost:8080'
VITE_AI_URL='http://localhost:11434/api/generate'
VITE_OLLAMA_MODEL='llama3:latest'
```

Если у тебя другая модель в `Ollama`, замени `VITE_OLLAMA_MODEL` на фактическое имя из команды:

```bash
ollama list
```

## Установка

```bash
npm install
```

## Запуск в dev-режиме

1. Подними backend на `http://localhost:8080`.
2. Если нужны AI-функции, запусти `Ollama`.
3. Убедись, что нужная модель скачана, например:

```bash
ollama pull llama3:latest
```

4. Запусти фронтенд:

```bash
npm run dev
```

По умолчанию Vite поднимет приложение на локальном dev-сервере, обычно это `http://localhost:5173`.

## Доступные команды

```bash
npm run dev
```

Запуск dev-сервера.

```bash
npm start
```

Проверка ESLint.

## Как работает API в dev-режиме

Во время локальной разработки Vite проксирует запросы:

- `/api` -> `VITE_BACKEND_URL`
- `/ai-api` -> `VITE_AI_URL`

Это настроено в [vite.config.ts](/c:/Users/Daniil/pets/Avito/Frontend/avito-frontend/vite.config.ts).

## AI-функции

В форме редактирования объявления используются локальные AI-запросы через `Ollama`:

- генерация описания
- оценка рыночной цены

Если AI не отвечает:

1. проверь, что `Ollama` запущен;
2. проверь, что модель существует через `ollama list`;
3. проверь соответствие `VITE_OLLAMA_MODEL` установленной модели.

## Описание принятых решений

Мною был изменен Backend. А именно я изменил запрос на получение всех объявлений, чтобы для каждого элемента так же возвращался id, чего не был реализованно в оригинальном Backend
