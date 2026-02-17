# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build for staging (school-api-dev) or override with --build-arg
ARG BUILD_CONFIG=staging
RUN npm run build -- --configuration=${BUILD_CONFIG}

# Stage 2: Serve
FROM nginx:alpine

COPY --from=build /app/dist/school-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
