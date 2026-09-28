FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY tsconfig*.json ./

RUN pnpm install --frozen-lock

COPY . .

RUN pnpm build


FROM caddy:2-alpine AS webapp

COPY --from=builder /app/dist /usr/share/caddy/