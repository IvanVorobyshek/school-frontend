# Northflank: полная настройка (develop)

Подробная инструкция по деплою **school-frontend** и **school-api** на Northflank, ветка `develop`.

---

## Архитектура

```
Project: school
├── school-api-dev       ← Backend (IvanVorobyshek/school-api, develop)
├── school-frontend-dev  ← Frontend (IvanVorobyshek/school-frontend, develop)
├── postgres-dev         ← Addon PostgreSQL
└── redis-dev            ← Addon Redis
```

---

# Часть 1. Backend (school-api-dev)

> Если backend уже настроен — переходи к [Части 2](#часть-2-frontend-school-frontend-dev).

## 1.1. GitHub

1. **Settings** → **Git integrations** → **Link GitHub**
2. Выбери репозиторий **IvanVorobyshek/school-api**

## 1.2. Проект и Addons

1. **Create** → **Project** → Name: `school`
2. **Create** → **Addon** → **PostgreSQL** → Name: `postgres-dev`
3. **Create** → **Addon** → **Redis** → Name: `redis-dev`
4. Дождись статуса **Running** у обоих addons

## 1.3. Combined Service (Backend)

1. **Create** → **Service** → **Combined**
2. **Basic:** Name: `school-api-dev`
3. **Repository:**
   - Git: GitHub
   - Repository: `IvanVorobyshek/school-api`
   - Branch: **develop**
4. **Build options:**
   - Build type: **Dockerfile**
   - Dockerfile path: `/Dockerfile`
   - Build context: `/`
5. **Build rules** (Advanced):
   - CI: **Enabled**
   - Branch rules: `develop`
6. **Resources:** Compute plan, 1 instance
7. **Networking:** Public port **80** → **Expose**
8. **Addons:** Attach `postgres-dev`, `redis-dev`

## 1.4. Environment Variables (Backend)

В сервисе **school-api-dev** → **Environment** → **Environment variables**:

| Key | Value |
|-----|-------|
| `APP_NAME` | `school` |
| `APP_ENV` | `development` |
| `APP_DEBUG` | `true` |
| `APP_KEY` | *(сгенерируй: `php artisan key:generate --show`)* |
| `APP_URL` | *(после деплоя: URL из Networking)* |
| `DB_CONNECTION` | `pgsql` |
| `DB_URL` | *(из postgres-dev → Connection details → POSTGRES_URI)* |
| `CACHE_STORE` | `redis` |
| `SESSION_DRIVER` | `redis` |
| `QUEUE_CONNECTION` | `redis` |
| `REDIS_URL` | *(из redis-dev → Connection details → REDIS_MASTER_URL)* |
| `LOG_LEVEL` | `debug` |

## 1.5. Build и миграции

1. **Build** → Branch `develop` → **Start build**
2. После успешного deploy → **Execute** → `php artisan migrate --force`
3. Скопируй **Public URL** из Networking (например `https://p01--school-api-dev--xxxxx.code.run`)

---

# Часть 2. Frontend (school-frontend-dev)

## 2.1. GitHub

1. **Settings** → **Git integrations** → **Link GitHub**
2. Добавь репозиторий **IvanVorobyshek/school-frontend** (если ещё не добавлен)

## 2.2. Combined Service (Frontend)

1. В проекте **school**: **Create** → **Service** → **Combined**
2. **Basic:** Name: `school-frontend-dev`
3. **Repository:**
   - Git: GitHub
   - Repository: `IvanVorobyshek/school-frontend`
   - Branch: **develop**
4. **Build options:**
   - Build type: **Dockerfile**
   - Dockerfile path: `/Dockerfile`
   - Build context: `/`
5. **Build rules** (Advanced):
   - CI: **Enabled**
   - Branch rules: `develop`
6. **Resources:** Compute plan, 1 instance
7. **Networking:** Public port **80** → **Expose**

## 2.3. Build args (опционально)

По умолчанию frontend собирается с конфигом `staging`, который указывает на `school-api-dev`.

Если URL backend отличается — см. [Часть 3](#часть-3-связь-фронта-с-беком).

---

# Часть 3. Связь фронта с беком

## 3.1. CORS (Backend)

В `school-api` уже настроен CORS для Northflank:

- `config/cors.php` → `allowed_origins_patterns`: `#^https://.*\.code\.run$#`

Все домены `*.code.run` разрешены. Дополнительно ничего делать не нужно.

## 3.2. API URL во frontend

API URL задаётся **на момент сборки** в `src/environments/environment.staging.ts`:

```ts
apiUrl: 'https://p01--school-api-dev--tcnk9xh79l5p.code.run'
```

**Важно:** заменить этот URL на **реальный Public URL** твоего `school-api-dev` из Northflank.

### Вариант A: Правка в репо (рекомендуется)

1. Открой `src/environments/environment.staging.ts`
2. Замени `apiUrl` на URL backend (из Networking → school-api-dev)
3. Закоммить и запушь в `develop`
4. Northflank автоматически пересоберёт frontend

### Вариант B: Build arg (если поддерживается)

Если нужна гибкость без правок кода — можно добавить поддержку `API_URL` как build arg в Dockerfile и `environment.staging.ts`. Сейчас используется фиксированный URL.

## 3.3. Проверка связи

1. Открой Public URL frontend (например `https://p01--school-frontend-dev--xxxxx.code.run`)
2. Нажми **Check API** — запрос пойдёт на mock (Postman)
3. Нажми **Check Users** — запрос пойдёт на `apiUrl` из `environment.staging.ts` (твой backend)

Если **Check Users** возвращает данные — связь настроена верно.

> **Локально:** для проверки с Sail используй `ng serve --configuration=local` — тогда Check Users пойдёт на `http://localhost/api/users`.

---

# Чеклист

## Backend
- [ ] GitHub: IvanVorobyshek/school-api
- [ ] Addons: postgres-dev, redis-dev
- [ ] Service: school-api-dev, branch develop
- [ ] Build: Dockerfile, path /Dockerfile
- [ ] Addons привязаны к service
- [ ] Environment variables (APP_KEY, DB_URL, REDIS_URL и т.д.)
- [ ] Build выполнен, deploy Running
- [ ] Миграции: `php artisan migrate --force`
- [ ] Public URL скопирован

## Frontend
- [ ] GitHub: IvanVorobyshek/school-frontend
- [ ] Service: school-frontend-dev, branch develop
- [ ] Build: Dockerfile, path /Dockerfile
- [ ] Build rules: CI, branch develop
- [ ] Build выполнен, deploy Running

## Связь
- [ ] В `environment.staging.ts` указан реальный URL backend
- [ ] Push в develop → frontend пересобрался
- [ ] Check Users на фронте возвращает данные с backend

---

# Troubleshooting

| Проблема | Решение |
|----------|---------|
| CORS error при Check Users | Проверь, что backend CORS включает `*.code.run` |
| Check Users → 404 | Проверь `apiUrl` в environment.staging.ts |
| Check Users → Network error | Backend может быть недоступен; проверь Public URL backend в браузере |
| Frontend показывает старый API | Пересобери frontend (Build → Start build) после правки environment.staging.ts |
