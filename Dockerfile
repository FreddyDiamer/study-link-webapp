FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build


FROM caddy:2-alpine AS webapp

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist /srv/www