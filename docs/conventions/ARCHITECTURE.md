# Architecture

Trust class: `current`. This is THE architecture doc — on conflict with code, this doc wins and the code should be migrated (deviations are tracked in [CLAUDE.md → Migration status](../../CLAUDE.md#migration-status-known-tech-debt)).

## Project layout

```
src/
├── main.ts                  # bootstrap: Vue + Pinia + router, telegram init
├── App.vue                  # shell: AppHeader + <RouterView> + BottomNav; app init
├── router/
│   ├── paths.ts             # PATHS const — single source of truth for all URLs
│   └── index.ts             # route definitions (all pages lazy-loaded)
├── views/                   # WelcomeView (role selection), TestView
├── features/                # feature modules by role
│   ├── student/{pages,components,composables}
│   ├── tutor/{pages,components,composables}
│   └── admin/components
├── services/
│   ├── api/                 # low-level HTTP: client.ts + one module per resource
│   ├── business/            # business logic: singleton service classes
│   └── integrations/        # telegram.ts — Telegram WebApp wrapper (init, haptics, alerts)
├── stores/                  # Pinia: app, auth, telegram, education
└── shared/
    ├── components/{ui,layout,icons}   # UI kit (see conventions/STYLES.md); AppHeader, BottomNav
    ├── composables/         # useEducation, useTutor, useService, useOrder, useTelegram, useAuth (deprecated)
    ├── constants/           # APP, USER_ROLES, ORDER_STATUS, VALIDATION, STORAGE_KEYS
    ├── types/               # central TS types (ApiResponse, Service, Order, Deal, …)
    └── utils/               # formatters, storage, validation, common
```

## Layers

```
┌──────────────────────────────────────────────┐
│  Pages & Components (src/features, views)    │  render state, handle user input
├──────────────────────────────────────────────┤
│  Composables (shared/ + feature-local)       │  reusable reactive logic, store proxies
├──────────────────────────────────────────────┤
│  Business services (src/services/business)   │  validation, error mapping, haptics
├──────────────────────────────────────────────┤
│  API layer (src/services/api)  +  Stores     │  pure HTTP        │  global state (Pinia)
└──────────────────────────────────────────────┘
```

Dependencies point **downward only**:

- Components use **composables** or **business services** — never `services/api` directly.
- Business services use the **API layer** for requests and **stores** for state.
- API modules are pure and independent: no business logic, no store access.

```ts
// ❌ Never in a component
import { tutorsApi } from '@/services/api'

// ✅ Always through the business layer
import { tutorService } from '@/services/business'
```

## API layer — `src/services/api/`

One module per backend resource (`auth.ts`, `users.ts`, `tutors.ts`, `orders.ts`, `education.ts`, `reviews.ts`), all exported via `index.ts`. Purpose: typed HTTP calls, nothing else.

[`client.ts`](../../src/services/api/client.ts) is the single HTTP entry point — an axios singleton that:
- unwraps the backend envelope: `get<T>()` returns `response.data.data` (`ApiResponse<T>`)
- injects `Authorization: Bearer <token>` from localStorage (`STORAGE_KEYS.AUTH_TOKEN`)
- on 401: clears auth keys and redirects to `/auth`

```ts
// services/api/tutors.ts — pattern
import { apiClient } from './client'
import type { Tutor, TutorSearchParams, PaginatedResponse } from '@/shared/types'

export const tutorsApi = {
  search: (params: TutorSearchParams) =>
    apiClient.get<PaginatedResponse<Tutor>>('/tutors', params),
  getById: (id: string) => apiClient.get<Tutor>(`/tutors/${id}`),
}
```

Types come from `src/shared/types/` — don't redeclare them inside API modules.

## Business layer — `src/services/business/`

Singleton service classes, one per domain (`auth`, `user`, `tutor`, `order`, `service`, `review`, `education`), exported as instances via `index.ts`:

```ts
// services/business/tutor.ts — pattern
export class TutorService {
  async searchTutors(params: TutorSearchParams) {
    this.validateSearchParams(params)          // 1. validate input
    try {
      return await tutorsApi.search(params)    // 2. call API layer
    } catch (error) {
      throw new Error(this.getErrorMessage(error)) // 3. map to user-facing message
    }
  }

  private getErrorMessage(error: unknown): string {
    // maps HTTP status → readable Russian message
    // 404 → 'Репетитор не найден', 5xx → 'Проблемы на сервере. Попробуйте позже', …
  }
}

export const tutorService = new TutorService()
```

Responsibilities: input validation, error mapping to **Russian** user-facing messages, Telegram UX on user actions (via the `telegram` **store**, which delegates to `services/integrations/telegram.ts`), price handling (rubles, plain numbers — see [CLAUDE.md → Domain rules](../../CLAUDE.md#domain-rules)).

## Stores — `src/stores/`

Pinia **setup stores**: `app` (active flow student/tutor), `auth` (user + token, canonical auth), `telegram` (WebApp state), `education` (global reference data).

Conventions:
- `defineStore('name', () => { ... })` setup style
- expose state as `readonly()` refs + explicit mutation functions (see `auth.ts`)
- persist through `STORAGE_KEYS` (`kai_*`) from `src/shared/constants`

## Composables — `shared/composables/` and `features/*/composables/`

`useXxx()` factories returning refs + methods. Two flavors:
- **Store proxies** (e.g. `useEducation`) — thin computed wrappers over a Pinia store.
- **Feature logic** (e.g. `useService`, `useOrder`) — encapsulate loading/error state around business-service calls.

`useAuth.ts` is **deprecated** (mock) — the canonical auth is the `auth` store; see CLAUDE.md.

## Global reference data (education)

Subjects, teachers, and teacher-subject links are loaded **once** at app start:

```
App.vue → educationStore.initialize()   // parallel load, guarded by isInitialized
       → components consume via useEducation()
```

Rules for components needing this data:
- use `useEducation()` — never call `educationService` / `educationApi` directly
- check `isInitialized` before use
- `refresh()` re-fetches when data must be reloaded

## Error handling flow

```
API layer          → propagates axios errors untouched (401 handled globally in client.ts)
Business layer     → try/catch, throws Error with a readable Russian message
Component          → try/catch around the call; renders isLoading / error state
```

Never show raw technical errors to the user; never swallow errors silently.

## Checklist: adding a new feature

1. **Types** — add/extend domain types in `src/shared/types/`.
2. **API module** — add methods to the resource module in `services/api/` (or create one + export in `index.ts`).
3. **Business service** — add logic to the domain service in `services/business/` (validation, error mapping, haptics).
4. **Composable** (optional) — if the loading/error logic is reused across components.
5. **Page/components** — under `features/student/` or `features/tutor/`; page files end with `Page.vue`.
6. **Route** — add the URL to `PATHS` in `src/router/paths.ts`, register a lazy-loaded route in `router/index.ts`.
7. **Forms** — vee-validate + yup (target pattern; see CLAUDE.md).
8. **Styling** — Tailwind with `telegram-*` tokens, UI kit from `@components/ui` — see [STYLES.md](STYLES.md).
