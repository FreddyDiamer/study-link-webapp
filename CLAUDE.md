# CLAUDE.md — Study Link frontend

**Study Link** is a Telegram Mini App: a tutoring marketplace connecting **students** and **tutors**.
Students post requests (orders) and browse tutor services; tutors publish services and respond to requests.
The backend is a separate NestJS API (not in this repo) — see [docs/API_INTEGRATION.md](docs/API_INTEGRATION.md).

Stack: **Vue 3.5** (Composition API, `<script setup lang="ts">`) · **TypeScript 6** (strict) · **Vite 8** (Rolldown) · **Pinia 4** · **Vue Router 5** · **Tailwind CSS 4** (CSS-first theme, no config file) · **axios**. Telegram integration goes through the global `window.Telegram.WebApp` typed by `@types/telegram-web-app` — there is no Telegram SDK package.

Before any non-trivial task, check **[docs/INDEX.md](docs/INDEX.md)** — it maps typical tasks to the docs you should read first.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Dev server on port **3050** (`host: true`) |
| `pnpm build` | Type-check (`vue-tsc`) + production build |
| `pnpm type-check` | `vue-tsc --build` only |
| `pnpm preview` | Preview the production build |
| `pnpm format` | Prettier over `src/` (no semi, single quotes, width 100) |

There is **no lint script and no test setup** in this project, so `pnpm type-check` is the only automated verification:
run it **once after completing a coding task** to confirm the code compiles. Don't run it repeatedly mid-task, and don't run `pnpm build` unless explicitly asked.

> **`pnpm type-check` does not pass on a clean tree.** There are **31 pre-existing errors** in 7 files
> (`GroupsManager.vue`, `ServiceFilters.vue`, `EditOrderPage.vue`, student `OrdersPage.vue`,
> `DealFilters.vue`, `services/business/education.ts`, `shared/composables/useAuth.ts`).
> Compare your output against that baseline instead of expecting zero — and fix the ones in files
> you touch. `pnpm build` therefore fails too; use `pnpm build-only` to check the bundler alone.

## Architecture

Feature-based layout: `features/{student,tutor,admin}` (pages/components/composables by role), `services/{api,business,integrations}`, `stores/` (Pinia), `shared/` (UI kit, composables, types, utils), `router/`.

**Layer rules (strict)**:

- Dependency flow: `Components/Pages → composables / services/business → services/api + stores`. Components must **never** import from `services/api` directly.
- Everything else — the full `src/` tree, per-layer contracts, code patterns, error-handling flow, new-feature checklist — lives in [docs/conventions/ARCHITECTURE.md](docs/conventions/ARCHITECTURE.md). **Read it before writing a new feature, service, or API call.**

## Vue conventions

- SFC block order: `<script setup lang="ts">` → `<template>` → `<style>` (styles almost never used — Tailwind only).
- PascalCase component filenames; pages end with `Page.vue` (e.g. `CreateServicePage.vue`).
- Event handlers are prefixed with `handle` (`handleSubmit`, `handleClick`).
- Type-based props: `defineProps<Props>()`, with `withDefaults()` when defaults are needed.
- Prefer `const fn = () => {}` with explicit types over `function` declarations; use early returns.
- Reuse UI primitives from `@components/ui` (`Button`, `Card`, `Input`, `Select`, `Modal`, `Loader`, `Rating`) — do not create duplicates.

## TypeScript

- Strict mode; no `any`, no `@ts-ignore`.
- Shared/domain types live in `src/shared/types/`; feature-local types stay in the feature.

## Routing

- Every URL comes from `PATHS` in [paths.ts](src/router/paths.ts) — never hardcode route strings; new pages are lazy-loaded.
- There are currently **no navigation guards** (auth is not route-enforced).

## State (Pinia)

Setup stores (`app`, `auth`, `telegram`, `education`); expose state as `readonly()`, persist via `STORAGE_KEYS` (`kai_*`). Subjects/teachers come only through `useEducation()` — store patterns in [docs/conventions/ARCHITECTURE.md](docs/conventions/ARCHITECTURE.md).

## Target patterns

These are the standards to follow for new and modified code, even where existing code doesn't comply yet (see Migration status below):

- **Auth**: the canonical mechanism is [stores/auth.ts](src/stores/auth.ts) + `services/business/auth`. `shared/composables/useAuth.ts` is **deprecated** (mock, module-level state) — do not extend it; migrate call sites to the store when touching them.
- **Forms**: validate with **vee-validate + yup** (both installed). Do not add new hand-rolled `validateForm()` implementations.

## Domain rules

- **Prices are in rubles everywhere** — plain numbers, no kopeks conversion (the old kopeks convention is obsolete). Display via `formatPrice` (`src/shared/utils/formatters.ts`).
- Roles `student` / `tutor` / `both` (`USER_ROLES`); the active flow lives in the `app` store and sets `flow-student` / `flow-tutor` root classes.
- **All user-facing text is Russian** (UI labels, error messages, alerts); code identifiers stay English.
- Telegram UX (haptics, alerts): business services call the `telegram` **store**, which delegates to `services/integrations/telegram.ts`. Components should not call Telegram APIs directly (target — see Migration status).
- Auth flow (initData → JWT → localStorage): see [docs/API_INTEGRATION.md](docs/API_INTEGRATION.md).

## Path aliases

| Alias | Resolves to |
| --- | --- |
| `@` | `src` |
| `@shared` | `src/shared` |
| `@components` | `src/shared/components` |

Defined in **both** `vite.config.ts` and `tsconfig.app.json` — keep them in sync when adding aliases.

## Agent skills

`.claude/skills/` holds vendored Vue/TypeScript/a11y reference material that Claude Code loads on
demand: `vue-best-practices`, `vue-router-best-practices`, `vue-pinia-best-practices` (from
[vuejs-ai/skills](https://github.com/vuejs-ai/skills)), `vue3-reference` and `web-accessibility`
(from [github/awesome-copilot](https://github.com/github/awesome-copilot)), plus `typescript-strict`
and `tailwind-v4`.

They describe Vue in general — **this file and `docs/` always win on conflict**. Provenance and the
list of upstream rules deliberately rejected (and why) are in
[.claude/skills/README.md](.claude/skills/README.md).

## Git commits

- Prefix with type: `feat:`, `fix:`, `refactor:`, `chore:`, …
- Max **50 characters**, present tense, specific (no bare "update" / "fix bug").

## Migration status (known tech debt)

Known gaps between the current code and the target patterns above. Don't treat these as examples to copy; fix them opportunistically when touching the code:

- Two auth mechanisms coexist: real `stores/auth.ts` vs deprecated mock `shared/composables/useAuth.ts` (its `login` has a TODO and fake data).
- Forms use manual `reactive()` + `validateForm()` instead of vee-validate/yup.
- Leftover no-op price converters in `services/business/service.ts` (`convertServiceToRubles`, `convertFiltersToKopeks`) — dead weight from the removed kopeks convention; safe to delete when touching the file.
- `console.log` placeholders stand in for notifications/analytics in some business services.
- Many feature components call the `telegram` store / `telegramService` directly instead of going through business services.
- On 401 `services/api/client.ts` redirects to `/auth` — a route that does not exist in the router (dead redirect).
- `allowedHosts: true` + `host: true` in `vite.config.ts` is still marked `TODO: remove` — the dev
  server accepts any Host on every interface, which matters because Mini App development usually
  tunnels it publicly. Narrow it to the actual tunnel host.
- 31 pre-existing `vue-tsc` errors (see the box under Commands) — no test suite exists to catch
  the behaviour they hide.
- `pnpm.overrides` in `package.json` pins `postcss` / `nanoid` / `browserslist` / `picomatch`
  forward. They exist only to clear dev-only advisories in transitive deps of
  `vite-plugin-vue-devtools` and `npm-run-all2`; drop each one once its parent ships a fixed range.
- TypeScript is held at **6.0**: `vue-tsc` 3.3 cannot run on TypeScript 7 (it patches
  `typescript/lib/tsc`, which the native Go compiler no longer ships). Retry TS 7 when vue-tsc
  supports tsgo.
