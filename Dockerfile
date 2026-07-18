FROM node:22-alpine AS builder
RUN npm install -g pnpm

WORKDIR /app
COPY package*.json ./
COPY . .
RUN pnpm run build

FROM node:22-alpine
RUN npm install -g pnpm

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/src/main"]