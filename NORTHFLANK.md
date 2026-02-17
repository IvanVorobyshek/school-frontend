# Northflank: school-frontend-dev

## Настройка

1. **Create** → **Service** → **Combined**
2. Name: `school-frontend-dev`
3. Repository: GitHub → school-frontend, branch: `develop`
4. **Build:** Dockerfile, path `/Dockerfile`, context `/`
5. **Build rules:** CI enabled, branch `develop`
6. **Resources:** Compute plan, 1 instance
7. **Networking:** Public port **80** → Expose

## Build args (опционально)

- `BUILD_CONFIG=staging` — по умолчанию (API: school-api-dev)
- `BUILD_CONFIG=production` — для prod

## Environment

API URL задаётся в `src/environments/environment.staging.ts` на момент сборки.
