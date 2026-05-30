FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json vite.config.ts tsconfig.json index.html ./
COPY src/ ./src/
RUN npm ci && npx vite build

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache tini
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/src/ ./src/
COPY --from=frontend /app/dist ./dist
EXPOSE 3001
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/index.js"]
