# School Frontend (Angular)

Frontend для SaaS платформы онлайн-школ. Связка с `school-api` (Laravel).

## Запуск

```bash
npm install
npm start
```

Откроется http://localhost:4200

## Конфигурации

| Команда | API |
|---------|-----|
| `npm start` | Mock Server (Postman) |
| `ng serve --configuration=staging` | school-api-dev (Northflank) |
| `ng serve --configuration=local` | localhost (Sail) |
| `ng build --configuration=production` | school-api prod |

npm start -- --configuration=local

## Northflank

- **Dockerfile** — multi-stage: Node build + nginx serve
- **Build:** `staging` (по умолчанию) — API: school-api-dev
- **Build arg:** `BUILD_CONFIG=production` для prod

## Структура

- `src/environments/` — URL API для каждого окружения
- `src/app/core/services/api.service.ts` — HTTP-клиент
- `src/app/pages/home/` — стартовая страница
