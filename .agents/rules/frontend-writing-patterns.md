# Frontend Writing Patterns — Study Link

Rules for writing/editing frontend code in this repo. Read before touching `src/`.
This is a **Telegram Mini App**: Vue 3.5 + TypeScript + Vite + Pinia + vue-router +
Tailwind. UI text is **Russian**; code identifiers and comments-for-intent are fine in
either language but match the surrounding file.

When a rule here conflicts with existing code, the rule wins for **new** code — the
codebase is mid-refactor (see "Design system" below) and several files still use the
old conventions. Don't cargo-cult the nearest file; cargo-cult these rules.

---

## 1. Where things live (feature-sliced)

```
src/
  features/<student|tutor|admin>/
    pages/        # route-level components (one per route)
    components/   # feature-local components
  shared/
    components/ui/        # design-system primitives: Button, Card, Input, Select, Modal, Loader, Rating
    components/icons/      # SVG icon components, re-exported via icons/index.ts
    components/layout/     # AppHeader, BottomNav
    composables/           # use*() — the API surface components consume
    utils/                 # formatters, validation, storage, common (pure functions)
    types/                 # all shared interfaces/enums (single index.ts barrel)
    constants/             # APP_*, API_BASE_URL, STORAGE_KEYS, VALIDATION, *_STATUS maps
  services/
    api/        # thin HTTP layer (axios). Returns raw server data. NO business logic.
    business/   # business logic: validation, kopeks↔rubles, haptics, error messages
    integrations/telegram.ts
  stores/       # Pinia setup-stores: auth, education, telegram, app
  router/       # index.ts (routes) + paths.ts (PATHS constants)
```

**Dependency flow — never reverse it:**

```
Pages/Components → composables (use*) → services/business → services/api + stores
```

- Components import from `@/shared/composables`, `@/shared/components/ui`, `@/stores`.
- Components must **not** import from `@/services/api/*` directly.
- `services/business` may use `services/api` and `stores`; `services/api` depends on nothing above it.
- Always import via the `@/` alias and the barrel (`@/shared/types`, `@/shared/components/ui`,
  `@/services/business`), not deep relative paths.

> ⚠️ Known inconsistency: some pages (e.g. `CreateOrderPage.vue`) call `orderService`
> directly instead of going through `useOrder()`. Don't copy that — prefer the composable.

---

## 2. Component authoring

- **Always** `<script setup lang="ts">`. Order blocks: `<script setup>` → `<template>` → `<style scoped>`.
- Typed props via an `interface Props` + `withDefaults(defineProps<Props>(), {...})`. Don't use the
  array/runtime props form.
- Typed emits via the call signature form: `defineEmits<{ 'update:modelValue': [value: string] }>()`.
- Prefer **`defineModel()`** (Vue 3.5) for two-way binding instead of hand-rolling
  `modelValue` prop + `update:modelValue` emit + watchers. (`Input.vue`/`Select.vue` predate this —
  new components should use `defineModel`.)
- Generate element ids with **`useId()`** (Vue 3.5), not `Math.random().toString(36)` and never
  the deprecated `String.prototype.substr`.
- Access template refs with **`useTemplateRef('name')`** rather than matching a bare `ref` to the name.
- Keep page components thin: data-loading + layout. Push reusable markup into
  `features/.../components` and reusable logic into composables.
- Script section order: imports (grouped Vue / router / stores / composables / services /
  components, as in `CreateOrderPage.vue`) → props/emits → composable & store setup →
  reactive state → computed → functions → watchers → lifecycle hooks.

### Computed classes
`Button.vue` builds a class string by hand. That's acceptable for a tiny variant map, but for
anything conditional prefer the array/object `:class` binding Vue supports natively rather than
string concatenation.

---

## 3. State & reactivity

- `ref()` for primitives and single objects; `reactive()` only for form-like grouped state
  (see the `form` object in `CreateOrderPage.vue`). Don't destructure a `reactive()`.
- Derive, don't duplicate: anything computable from other state is a `computed`, not a `ref` you
  keep in sync by hand.
- `computed` is read-only by default — don't mutate inside it.
- Use `watch`/`watchEffect` for side effects only, not for deriving values.

---

## 4. Composables (`use*`)

- One composable per domain (`useOrder`, `useTutor`, `useService`, `useEducation`, `useAuth`,
  `useTelegram`); re-export from `shared/composables/index.ts`.
- Shape: own local `ref` state (`isLoading`, result refs), wrap `services/business` calls, and
  `return { ...state, ...methods }` grouped with `// State` / `// Methods` comments.
- Loading pattern — wrap in `try/finally` so the flag always resets:

  ```ts
  const getDeals = async (params?: GetDealsParams) => {
    isLoading.value = true
    try {
      deals.value = await orderService.getDeals(params)
      return deals.value
    } finally {
      isLoading.value = false
    }
  }
  ```

- Be consistent about errors: either let them bubble (caller handles UX) **or** catch+log+rethrow —
  don't mix both styles within one composable the way `useOrder.ts` currently does.
- **Type the params.** Replace `params?: any` with a real DTO/filter type from `@/shared/types`.
  `any` is a smell, not a default.

---

## 5. Pinia stores

- **Setup-store style only:** `defineStore('name', () => { ...; return {...} })`. No options API.
- Layout inside the store, with section comments: `// State` (refs) → `// Getters` (computed) →
  `// Actions` (functions) → single `return`.
- Global, app-lifetime, shared-across-routes state belongs in a store (`auth`, `telegram`,
  `education`). Request-scoped, page-local data belongs in a composable/component, not a store.
- Cache expensive global loads behind an `isInitialized` guard and expose `refresh()`/`clear()`
  (see `stores/education.ts`). Initialize such stores once in `App.vue`, not per-page.
- Parameterized getters return a function from a `computed`:
  `const getById = computed(() => (id: string) => items.value.find(i => i.id === id))`.

---

## 6. Services

- `services/api/*`: thin axios wrappers via the shared `apiClient` (`get/post/put/patch/delete`),
  which already unwraps `ApiResponse<T>.data` and injects the bearer token. Define request/response
  types next to the methods or import from `@/shared/types`. No haptics, no alerts, no rubles math here.
- `services/business/*`: classes (`OrderService`, etc.) holding validation, error mapping
  (`handleError` → user-facing Russian message), Telegram side effects, and money conversion.
  Lazily resolve stores inside a getter (`private get telegramStore() { return useTelegramStore() }`)
  so the store/pinia is ready when called.
- Never surface a raw axios/technical error to the user — translate it (see `getErrorMessage` in
  `ARCHITECTURE.md`).

---

## 7. Money (critical gotcha)

The **server speaks kopeks**; the **UI speaks rubles**. Every monetary field
(`price`, `budget`, `balance`) is `// в копейках` in `@/shared/types`.

- Convert kopeks→rubles when reading and rubles→kopeks when writing **in `services/business`**, not
  scattered in components (`OrderService.convertRequestsToRubles` is the pattern).
- Display money only through `formatPrice()` from `@/shared/utils/formatters` (gives `1 500 ₽`).
  Never hand-format currency or hardcode `₽` concatenation in new code.
- Use `formatDate`/`formatDateTime`/`formatRelativeTime`/`formatRating`/`truncateText` from the same
  module instead of re-implementing.

---

## 8. Telegram Mini App

- All Telegram interaction goes through `useTelegramStore()` / `useTelegram()` — never touch
  `window.Telegram` directly.
- Add `hapticFeedback('light'|'medium'|'heavy')` on meaningful user actions (submit, navigate-back,
  confirm) — it's a core UX expectation here.
- Use `telegramStore.showAlert(...)` for errors/confirmations, **not** the native `alert()`.
- The dark theme is driven by Telegram `themeParams` via CSS variables (see design tokens) — don't
  assume hardcoded light/dark.

---

## 9. Design system & styling

> The design system is the **"Defiant" `d-*`** set (cool slate + indigo), encoded in
> `tailwind.config.js`, `claude-design/tokens.css`, and `claude-design/main-ds.html`. Full token
> reference + component anatomy: [`.agents/rules/frontend-design/design-system.md`](frontend-design/design-system.md).

**Use the `d-*` Tailwind tokens** (static slate palette):

| Purpose            | Token                                                                 |
|--------------------|-----------------------------------------------------------------------|
| Backgrounds        | `bg-d-ink` (app), `bg-d-panel` (cards), `bg-d-surface` (nested/tracks) |
| Text               | `text-d-text`, `text-d-text-second`, `text-d-text-hint`, `text-d-text-mute` |
| Accent (the only one) | `bg-d-accent` / `text-d-accent`, **text on it is `text-d-ink`** (dark) |
| Rating (ONLY)      | `text-d-rating` — gold, for ratings/stars/reviews **only**             |
| Semantic           | `d-teal` (completed/success), `d-coral` (destructive + avatar chips)   |
| Hairlines          | `border-d-border` (→ `d-border-hover` on hover); inputs `border-d-border-soft` |
| Status pills       | `<StatusBadge :deal|:response|:service>` → `.badge-pending/-accent/-progress/-teal/-coral/-neutral` |
| Typography         | `text-screen-title` `text-title-m` `text-price` `text-body` `text-subhead` `text-caption` |
| Radii              | `rounded-field` (10) `rounded-card` (15) `rounded-sheet` (16) `rounded-chip` (9) |
| Font / numbers     | `font-sl`; add `tnum` to money/ratings/counts                         |
| Shadow / motion    | `shadow-d-toast` (floating only); `.reveal` `.press` `.skeleton`, `animate-d-*` |

**Design principles (from `claude-design/main-ds.html`):**
- **One primary action per screen.** Everything else is secondary/ghost.
- **Status is always visible** — render via `<StatusBadge>` (never hand-rolled colors).
- **Reputation-forward** — gold rating pill on cards; rating hero on detail/profile.
- **One accent (indigo).** Gold is ratings-only. Don't introduce other brand colors.
- **No card shadows**; separate regions with hairlines, not elevation.
- Spacing scale: 4 / 8 / 12 / 14 / 16 / 18.

**DON'T:**
- ❌ `telegram-*` / `sl-*` tokens — fully migrated to `d-*` (zero left).
- ❌ Raw Tailwind palette colors for UI chrome — **never** `bg-blue-600`, `text-gray-600`,
  `text-red-600`, ad-hoc spinners. Use `<Loader>` and `d-*` tokens.
- ❌ Gold for anything but ratings/reviews; a second action accent; card drop-shadows.

> The `@layer components` helpers `.btn*` / `.card` / `.input` / `.badge*` / `.segment` / `.chip` /
> `.info-*` are rebuilt on `d-*` — use them or `<Button>`/`<Card>`/`<Input>` from `ui/`.

**Building blocks:** reach for `@/shared/components/ui` (`Button`, `Card`, `Input`, `Select`,
`Modal`, `Loader`, `Rating`) and `@/shared/components/icons` before writing raw markup. Add new
shared primitives there, exported via the local `index.ts`.

---

## 10. Loading / empty / error states

Every data-driven view handles three states explicitly:
- **Loading** → `<Loader>` (not a hand-rolled `animate-spin` div).
- **Empty** → `EmptyState` component / friendly Russian copy.
- **Error** → Russian message + a retry affordance; never a raw error string.

---

## 11. Forms & validation

- `vee-validate` + `yup` are installed — prefer schema validation for non-trivial forms over the
  manual `validateForm()` boolean pattern in `CreateOrderPage.vue`.
- Keep validation thresholds in `@/shared/constants` (`VALIDATION.MIN_PRICE`, etc.), not inline magic numbers.
- Disable the submit button while `isSubmitting` and reflect it with `:loading` on `<Button>`.

---

## 12. Misc utilities available — use them

- `@vueuse/core` is installed. Use `onClickOutside`, `useEventListener`, etc. instead of manually
  `addEventListener`/`removeEventListener` in `onMounted`/`onUnmounted` (as `Select.vue` does today).
- `lucide-vue-next` is available for icons not already in `shared/components/icons`.
- Route navigation uses `vue-router` (`useRouter().push(...)`); reference paths via `PATHS` from
  `@/router/paths`, not string literals.

---

## TL;DR checklist for a new component

- [ ] `<script setup lang="ts">`, typed `Props`/emits, `defineModel`/`useId` where relevant
- [ ] Data via a `use*` composable → `services/business`; no `services/api` import in the component
- [ ] `isLoading` in `try/finally`; loading/empty/error all handled
- [ ] Money converted in business layer, displayed via `formatPrice`
- [ ] `d-*` tokens + `<StatusBadge>` + `@/shared/components/ui` primitives — no `telegram-*`/`sl-*`,
      no raw palette colors; gold (`d-rating`) for ratings only
- [ ] One primary action; status + money + deadline visible on cards
- [ ] Haptics + `showAlert` via the Telegram store for user actions
- [ ] No `any` (type the DTOs), no `Math.random` ids, no native `alert`
