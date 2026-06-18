# CLAUDE.md

Main guidance for Claude Code working in this repository.

---

## ⚠️ Always check `.agents/rules/` first

**Before any coding task in this repo, read the relevant rule files in `.agents/rules/`.**
They are the source of truth for how code must be written here and override generic habits.

- Frontend / Vue / styling work → **`.agents/rules/frontend-writing-patterns.md`** (read it first).
- Treat every file in `.agents/rules/` as an active rule; if a new one is added, consult it too.
- When a rule conflicts with existing code, the rule wins for **new** code (the repo is
  mid-refactor — see "Current state" below). Don't change working code you weren't asked to touch.

---

## What this project is

**Study Link** (package name `kai-repetitor`) is a **Telegram Mini App** — a marketplace that
connects students with tutors (репетиторы), used inside Telegram. UI language is **Russian**.

It is the **frontend** (Vue SPA) of a two-part system; the backend is a separate **NestJS** API
(not in this repo) documented in `INTEGRATION.md`. The app runs inside Telegram's WebApp container,
authenticates via Telegram `initData`, and is themed from Telegram's `themeParams`.

### Product domains

- **Two user flows** chosen at runtime and persisted in `localStorage`: **student** and **tutor**
  (`useAppStore().currentFlow`, classes `flow-student` / `flow-tutor`). Each flow has its own pages
  and bottom navigation; routes are namespaced `/student/*` and `/tutor/*`.
- **Education catalog:** subjects, teachers, teacher↔subject links. Loaded **once** at startup into
  a global store (`useEducationStore`) and consumed everywhere via `useEducation()`.
- **Marketplace:**
  - **Services** — offers created by tutors.
  - **Requests** (заявки) — needs posted by students.
  - **Responses** — a student responds to a Service; a tutor responds to a Request.
  - **Deals** (сделки) — a matched agreement, with a status lifecycle
    (`PENDING → ACCEPTED → IN_PROGRESS → COMPLETED`, or `CANCELLED`).
  - **Reviews** — left on a completed deal, targeting either role.
- **Money:** the backend stores all amounts in **kopeks**; the UI works in **rubles**. Conversion
  happens in the business-service layer. (See the money rule in the frontend rules file.)

---

## Tech stack

- **Vue 3.5** (`<script setup lang="ts">`, Composition API only) + **TypeScript**.
- **Vite 6** build (terser, manual vendor chunks), dev server on **port 3050**.
- **Pinia** (setup-store style) for global state.
- **vue-router 4** (web history); paths centralized in `src/router/paths.ts` as `PATHS`.
- **Tailwind CSS 3** (+ PostCSS, autoprefixer) for styling; custom theme tokens, no UI kit.
- **axios** for HTTP, wrapped by a single `apiClient`.
- **@telegram-apps/sdk-vue** + `@types/telegram-web-app` for the Telegram WebApp bridge.
- **@vueuse/core** utilities; **vee-validate** + **yup** available for forms;
  **lucide-vue-next** for icons.
- **pnpm** package manager. Linting/formatting via **Prettier** (`pnpm format`).

### Scripts

```sh
pnpm dev          # vite dev server (port 3050)
pnpm build        # type-check (vue-tsc) + production build
pnpm preview      # preview the production build
pnpm type-check   # vue-tsc --build
pnpm format       # prettier --write src/
```

### Environment (`.env`, see `.env.example`)

- `VITE_API_BASE_URL` — backend base URL (default `http://localhost:3000/api`).
- `VITE_MOCK_TELEGRAM_INIT_DATA` — fake Telegram `initData` for local dev outside Telegram.

---

## Architecture & layering

Strict one-way dependency flow (see `ARCHITECTURE.md`, `INTEGRATION.md`):

```
Pages / Components  →  composables (use*)  →  services/business  →  services/api  +  stores
```

- **`services/api/*`** — thin axios wrappers over `apiClient`. `apiClient` injects the bearer token,
  unwraps `ApiResponse<T>.data`, and on **401** clears auth and redirects to `/auth`. No business logic.
- **`services/business/*`** — singleton service classes (`authService`, `orderService`,
  `serviceService`, `tutorService`, `userService`, `educationService`, `reviewService`). They hold
  validation, kopeks↔rubles conversion, Telegram side effects (haptics/alerts), and translate errors
  into user-facing Russian messages. Stores are resolved lazily inside getters.
- **`composables/*`** (`useAuth`, `useTelegram`, `useEducation`, `useOrder`, `useTutor`,
  `useService`) — the API surface components consume; own local `isLoading`/result refs and wrap the
  business services.
- **`stores/*`** (Pinia setup-stores): `auth` (user/token, localStorage-backed, exposes `readonly`
  state), `education` (global catalog with `isInitialized` cache + `refresh`/`clear`), `telegram`
  (WebApp bridge: haptics, alerts, main button), `app` (current flow + UI flags via
  `useLocalStorage`).
- **Components never import `services/api` directly** — always go through a composable/business service.

### Source map

```
src/
  main.ts                  # app bootstrap: pinia, router, telegramService.init()
  App.vue                  # shell: AppHeader + <RouterView> + BottomNav; runs initializeApp()
  features/<student|tutor|admin>/
    pages/                 # one component per route
    components/            # feature-local components
  shared/
    components/ui/         # design-system primitives: Button, Card, Input, Select, Modal, Loader, Rating
    components/icons/       # SVG icon components (barrel: icons/index.ts)
    components/layout/      # AppHeader, BottomNav
    composables/            # use*() (barrel: composables/index.ts)
    utils/                  # formatters, validation, storage, common (pure functions)
    types/                  # all shared interfaces/enums (single index.ts barrel)
    constants/              # APP_*, API_BASE_URL, STORAGE_KEYS, VALIDATION, *_STATUS maps
  services/{api,business,integrations}/
  stores/                  # auth, education, telegram, app (barrel: stores/index.ts)
  router/                  # index.ts (routes) + paths.ts (PATHS)
  views/                   # WelcomeView (entry/role pick), TestView
  assets/                  # main.css (@tailwind + @layer), base.css
```

### Path aliases (vite + tsconfig)

`@` → `src`, `@shared` → `src/shared`, `@components` → `src/shared/components`.
Prefer importing through barrels (`@/shared/types`, `@/shared/components/ui`, `@/services/business`,
`@/stores`).

### App startup sequence

`main.ts` mounts the app and calls `telegramService.init()`. `App.vue` then runs `initializeApp()`:
read Telegram `initData` (or `MOCK_INIT_DATA`) → `authService.loginWithTelegram()` →
`educationStore.initialize()` (loads subjects/teachers/links once, in parallel).

---

## Current state (important context)

The frontend is **fully migrated to the "Defiant" `d-*` design system** (cool slate + indigo):

- The design language lives in `claude-design/` (`tokens.css`, `main-ds.html`) and
  **`tailwind.config.js`** — `d-*` color tokens, semantic typography
  (`screen-title/title-m/price/body/subhead/caption`), radii (`field/card/sheet/chip/avatar`),
  `shadow-d-toast`, and `d-*` skeleton/reveal/press animations. Philosophy: one indigo accent, gold
  **only** for ratings, teal=completed, no card shadows, one primary action per screen,
  reputation-forward.
- Every `.vue`, `src/assets/{base,main}.css`, the `ui/` primitives, and the layout chrome use
  `d-*`. There are **zero** `telegram-*` / `sl-*` / default-palette colors left. Status pills render
  via `<StatusBadge>` (`@/shared/components/ui`) off `src/shared/constants/status.ts`.

**Write new frontend code against the `d-*` system** — full token reference + component anatomy in
`.agents/rules/frontend-design/design-system.md`; coding rules in
`.agents/rules/frontend-writing-patterns.md`.

> `npm run build` currently fails on **pre-existing** `vue-tsc` type errors (Select v-model typing,
> `getMyStudentDeals`, `getActiveSubjects`, `useAuth` User typing) — unrelated to styling;
> `npx vite build` succeeds.

Other notes: there are currently **no automated tests** wired up (the docs show example patterns
only). `vite.config.ts` has a `// TODO: remove this` on `allowedHosts: true`.

---

## Reference docs

- `.agents/rules/frontend-writing-patterns.md` — **the** frontend coding rules (read first).
- `ARCHITECTURE.md` — API/services/stores layering and conventions.
- `ARCHITECTURE_REFACTOR.md` — rationale for the global education store.
- `INTEGRATION.md` — backend API endpoints, auth flow, price-conversion contract.
- `.agents/rules/frontend-design/` — design-system token reference + senior-dev styling rules.
- `claude-design/` — design-system source: `tokens.css`, `main-ds.html` (the Defiant `d-*` look).
