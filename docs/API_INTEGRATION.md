# Backend API integration

Trust class: `reference` — the backend (NestJS, separate repo) is the source of truth for endpoints and payloads; verify against it (or the network tab) before relying on details here.

The frontend talks to the backend exclusively through `src/services/api/` (see [conventions/ARCHITECTURE.md](conventions/ARCHITECTURE.md)). Base URL comes from `VITE_API_BASE_URL`.

## Environment

`.env` (see `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MOCK_TELEGRAM_INIT_DATA=<initData string for browser dev outside Telegram>
```

Run the backend locally alongside `pnpm dev` (frontend on port 3050, backend on 3000 by default).

## Auth flow

1. Telegram provides `initData` to the Mini App (in browser dev, `VITE_MOCK_TELEGRAM_INIT_DATA` is used instead).
2. Frontend sends it to `POST /auth/telegram` and receives a JWT.
3. Token and user are persisted in localStorage (`kai_auth_token`, `kai_user` — `STORAGE_KEYS`).
4. `services/api/client.ts` interceptors attach `Authorization: Bearer <token>` to every request; on **401** they clear auth storage and redirect to `/auth`.

Canonical auth state lives in `stores/auth.ts` (see CLAUDE.md → Target patterns).

## Prices

**Rubles everywhere, plain numbers.** The frontend sends and receives prices in rubles with no conversion; the old "backend stores kopeks" convention is obsolete. Display formatting via `formatPrice` (`src/shared/utils/formatters.ts`). Minimum price validation: 100 ₽ (`VALIDATION.MIN_PRICE`).

## Response envelope

All endpoints return `ApiResponse<T>` (`{ data: T, ... }`); `apiClient` unwraps it, so API modules and everything above them work with `T` directly. List endpoints return `PaginatedResponse<T>` (`{ items, total, ... }`).

## Endpoints

No catalog here on purpose — it would rot. The sources of truth are:

- **Frontend side**: `src/services/api/` — one typed module per backend resource (`auth`, `users`, `tutors`, `orders`, `education`, `reviews`). To see what the frontend actually calls, read these modules.
- **Backend side**: the NestJS repo (Swagger) — authoritative for paths, payloads, and behavior.

Resource areas: auth, users, education (subjects/teachers reference data), marketplace (services, requests, deals, responses), reviews.

## Debugging

- Network tab: check the raw envelope, statuses, and the `Authorization` header.
- Vue DevTools: Pinia store state (`auth`, `education`, `app`, `telegram`).
- 401 loops usually mean an expired/invalid token in localStorage — clear `kai_*` keys.
