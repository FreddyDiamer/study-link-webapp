# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## ⚠️ Always check `.agents/rules/` first

**Before any coding task in this repo, read the relevant rule files in `.agents/rules/`.**
They are the source of truth for how code must be written here and override generic habits.

- Frontend / Vue / styling work → **`.agents/rules/frontend-writing-patterns.md`** (read it first).
- Treat every file in `.agents/rules/` as an active rule; if a new one is added, consult it too.
- When a rule conflicts with existing code, the rule wins for **new** code. Don't change working
  code you weren't asked to touch.
- The rule files' *source-map* snippets lag behind the code (they still mention
  `features/<student|tutor|admin>`, an `app` store, `Button/Card/Input` primitives). For what
  exists, trust this file and the code; for *how to write* code, trust the rules.

---

## What this project is

**Study Link** (package name `kai-repetitor`) is a **Telegram Mini App** — a marketplace that
connects students with tutors (репетиторы), used inside Telegram. UI language is **Russian**.

It is the **frontend** (Vue SPA) of a two-part system; the backend is a separate **NestJS** API
(not in this repo); the endpoints the frontend uses are the ones in `src/services/api/`. The app
runs inside Telegram's WebApp container and authenticates via Telegram `initData`. The look is the
fixed `d-*` design system — it does **not** follow Telegram's `themeParams`.

### Product domains

- **Role is a property of the object, not a mode of the person.** There is no flow switch and no
  `/student/*` / `/tutor/*` namespaces: one feed with a `Заявки / Услуги` segment, one set of
  screens, three tabs (`/market`, `/deals`, `/profile`). You are the customer on a request you
  posted and the worker on a service you published — the object says which.
- **Education catalog:** subjects, teachers, teacher↔subject links. Loaded **once** at startup into
  a global store (`useEducationStore`) and consumed everywhere via `useEducation()`.
- **Marketplace:**
  - **Services** — offers created by tutors.
  - **Requests** (заявки) — needs posted by students.
  - **Responses** — a student responds to a Service; a tutor responds to a Request.
  - **Deals** (сделки) — a matched agreement. The backend keeps five statuses, the UI shows three:
    «В работе» → «Завершена», plus «Отменена». A deal closes only when **both** sides confirm;
    if one stays silent, `autoConfirmAt` (from the backend — it never lands before the deal's own
    deadline) closes it.
  - **Reviews** — one from each side of a completed deal. Author, target and target role are
    derived server-side; the client sends only `dealId`, `rating` and `comment`.
  - **Requests have a lifecycle**: `OPEN → MATCHED` (a tutor was chosen) or `CLOSED` (the author
    closed it). The feed shows only `OPEN`; a closed request stays visible to its author and by
    direct link. Reopening publishes a new request — old responses are not resurrected.
- **Money:** amounts are **kopeks** everywhere, including through the business-service layer.
  Format for display with `formatKopeks()` from `@/shared/utils` — never divide by 100 by hand.
  Form inputs are in rubles and multiply by 100 on submit.

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
pnpm test         # vitest run (unit tests for pure logic)
pnpm test:watch   # vitest in watch mode
pnpm vitest run src/shared/utils/__tests__/formatters.spec.ts   # a single spec file
pnpm vitest run -t "formatKopeks"                               # tests matching a name
pnpm build        # type-check (vue-tsc) + production build
pnpm preview      # preview the production build
pnpm type-check   # vue-tsc --build
pnpm format       # prettier --write src/
```

### Environment (`.env`, see `.env.example`)

- `VITE_API_BASE_URL` — backend base URL (default `http://localhost:3000/api`).
- `VITE_MOCK_TELEGRAM_INIT_DATA` — fake Telegram `initData` for local dev outside Telegram.
  Honoured **only in dev builds** (`import.meta.env.DEV`) — in production it would let any browser in.

---

## Architecture & layering

Strict one-way dependency flow:

```
Pages / Components  →  composables (use*)  →  services/business  →  services/api  +  stores
```

- **`services/api/*`** — thin axios wrappers over `apiClient`. `apiClient` injects the bearer token,
  unwraps `ApiResponse<T>.data`, and on **401** clears auth and reloads the app root (`App.vue` re-authenticates from `initData`). No business logic.
- **`services/business/*`** — singleton service classes (`authService`, `orderService`,
  `serviceService`, `userService`, `educationService`, `reviewService`). They hold validation
  (money thresholds in kopeks), Telegram side effects (haptics/alerts), and translate errors into
  user-facing Russian messages. Stores are resolved lazily inside private getters.
- **`composables/*`** — the API surface components consume; own local `isLoading`/result refs and
  wrap the business services: `useOrder` (requests, responses, deals), `useService`,
  `useEducation`, `useMyResponses` (outgoing responses across both object kinds), `useDealsBadge`
  and `useInboxBadge` (module-level counters behind the tab badges: active deals / incoming
  responses still `PENDING`), `useTelegram`, `useToast`, `usePullToRefresh`, `useFormExit`,
  `useKeptScroll`. Domains without a composable (`userService`,
  `reviewService`, `authService`) are called from pages directly — that is the accepted pattern,
  not a violation.
- **`stores/*`** (Pinia setup-stores): `auth` (user/token, localStorage-backed, exposes `readonly`
  state), `education` (global catalog with `isInitialized` cache + `refresh`/`clear`), `telegram`
  (WebApp bridge: haptics, alerts, main button). There is no `app` store.
- **Components never import `services/api` directly** — always go through a composable/business
  service (type-only imports, as in `DevLogin.vue`, are the one exception).

### Source map

```
src/
  main.ts                  # app bootstrap: pinia, router, telegramService.init()
  App.vue                  # shell: AppToast + <RouterView> + BottomNav; runs initializeApp()
  features/<market|deals|profile>/   # one folder per tab
    pages/                 # one component per route
    components/            # feature-local components
  features/auth/DevLogin.vue   # dev-only web login (pick a seeded backend user)
  shared/
    components/ui/         # d-* primitives: ActionButton, BottomSheet, ActionsSheet, ConfirmSheet,
                           #   SegmentControl, StatusBadge, RatingChip, MoneyInput, DateField,
                           #   ToggleRow, LoadError, AppToast (barrel: ui/index.ts)
    components/layout/      # AppHeader (rendered by each page, not by App.vue), BottomNav
    components/             # AvatarChip, ReviewItem
    composables/            # use*() (barrel: composables/index.ts)
    utils/                  # formatters, validation, storage, common (pure functions)
    types/                  # all shared interfaces/enums (single index.ts barrel)
    constants/              # index.ts (API_BASE_URL, STORAGE_KEYS, VALIDATION…) + status.ts (*_STATUS_META)
  services/{api,business,integrations}/
  stores/                  # auth, education, telegram (barrel: stores/index.ts)
  router/                  # index.ts (routes) + paths.ts (PATHS + *Path(id) helpers)
  assets/                  # main.css (@tailwind + @layer), base.css
```

### Navigation conventions

- **List screens are kept alive.** `App.vue` wraps the route in `<KeepAlive>` for `MarketPage`,
  `DealsPage`, `ProfilePage`, `MyResponsesPage` (matched by file name). Pages scroll inside an inner
  `overflow-y-auto` block, so the router's `scrollBehavior` does not apply — each kept page calls
  `useKeptScroll(scroller, onReturn)`, which restores `scrollTop` on return and runs a **silent**
  reload (`load(true)` — no skeleton, the list must not jump). A kept page's `onMounted` runs once;
  anything that must refresh on return belongs in that `onReturn` callback. Re-tapping the active
  tab scrolls to top.
- **Forms leave no history entry.** After a successful submit call `useFormExit().exitTo(path)`
  (goes `back()` when `path` is the previous entry, otherwise `replace`) — never `router.push`, or
  «назад» from the result screen lands in the already-submitted form.

Icons come from `lucide-vue-next`; there is no local icons folder. Routes are flat and lazy-loaded;
`REQUEST_CREATE` and `REQUEST_EDIT` share `CreateRequestPage.vue`. Build parameterised links with
the helpers in `paths.ts` (`serviceDetailPath(id)`, `requestDetailPath(id)`, …), not string concat.

### Path aliases (vite + tsconfig)

`@` → `src`, `@shared` → `src/shared`, `@components` → `src/shared/components`.
Prefer importing through barrels (`@/shared/types`, `@/shared/components/ui`, `@/services/business`,
`@/stores`).

### App startup sequence

`main.ts` mounts the app and calls `telegramService.init()`. `App.vue` then runs `initializeApp()`:

- **Inside Telegram** (or dev with `MOCK_INIT_DATA`): `initData` →
  `authService.loginWithTelegram()`.
- **No `initData`**: restore the saved session from localStorage (`authStore.initializeAuth()`).
  If still unauthenticated, a dev build shows `DevLogin` (backend `/auth/dev/users` +
  `/auth/dev/login`); a production build shows «Откройте приложение в Telegram».
- Once authenticated: `educationStore.initialize()` (subjects/teachers/links, once, in parallel).

Routes and `BottomNav` render only when authenticated — there is no `/auth` route and no router
guard; a 401 sends the browser to `/`, where this sequence runs again.

---

## Testing

`pnpm test` runs vitest over the pure logic: money formatting and pluralisation
(`shared/utils/__tests__`), the money thresholds in the business layer, and the mapping of
outgoing responses (`shared/composables/__tests__`). Components are not tested. The backend has
its own Jest unit suite and e2e over a real database — see that repository.

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

`pnpm build` and `pnpm type-check` are green.

The screens are built against three design canvases: the MVP loop, the launch/trust states
(«Новый» instead of a zero rating, cold-start feed, two-sided confirmation, Telegram contact,
two-sided reviews) and the everyday-use states (request lifecycle, ownership actions in one `···`
menu, outgoing responses, profile and notifications, honest failure states vs emptiness).

Known gaps: a service has no view counter (the canvas shows one), and there is no pagination —
the feed shows what the first page returns. `vite.config.ts` still has a `// TODO: remove this`
on `allowedHosts: true`. The previous architecture (two role flows) is preserved in the
`no-design-system-branch` branch.

---

## Agent skills

`.claude/skills/` holds vendored Vue/TypeScript/a11y reference material that Claude Code loads on
demand: `vue-best-practices`, `vue-router-best-practices`, `vue-pinia-best-practices` (from
[vuejs-ai/skills](https://github.com/vuejs-ai/skills)), `vue3-reference` and `web-accessibility`
(from [github/awesome-copilot](https://github.com/github/awesome-copilot)), and `typescript-strict`.

They describe Vue in general — **this file and `docs/` always win on conflict**. Provenance and the
list of upstream rules deliberately rejected (and why) are in
[.claude/skills/README.md](.claude/skills/README.md).

## Reference docs

- `.agents/rules/frontend-writing-patterns.md` — **the** frontend coding rules (read first).
- `.agents/rules/frontend-design/` — design-system token reference + senior-dev styling rules.
- `claude-design/` — design-system source: `tokens.css`, `main-ds.html` (the Defiant `d-*` look).
- `docs/product/TODO-garant.md` — product roadmap for the «Гарант» (escrow) direction.
- `docs/UI_INVENTORY.md` — screen-by-screen inventory taken **before** the `d-*` redesign; history,
  not a description of today's UI.
- `docs/conventions/ARCHITECTURE.md`, `docs/API_INTEGRATION.md` — layering and auth-flow/response-
  envelope background. ⚠️ **Predate the current code**: together with `docs/INDEX.md` and
  `docs/conventions/STYLES.md` they still say "rubles everywhere, no kopeks" and prescribe
  `telegram-*` tokens, a `flow-student/flow-tutor` theme and a `Button/Card/Input` kit. All of that
  is wrong now — money is kopeks and styling is `d-*`, as described above. Where those docs
  disagree with this file or `.agents/rules/`, they lose.
- `.cursor/rules/front-end-cursor-rules.mdc` — older Cursor rules. Still applicable: SFC order
  `<script>` → `<template>` → `<style>`, early returns, `handle*` names for event handlers, arrow
  `const` functions, conventional-commit prefixes (`feat:`, `fix:`, `refactor:`…) with a short
  present-tense subject.
