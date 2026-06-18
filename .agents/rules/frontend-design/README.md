# Frontend Design Rules

Rules for building UI in **Study Link** — a Telegram Mini App marketplace for tutors.
Read these before writing or editing any `.vue`, Tailwind class, or `src/assets/*.css`.

## Files

| File | What it is | When to read |
| --- | --- | --- |
| [`design-system.md`](./design-system.md) | **Source of truth** for every design token: colors, type scale, spacing, radius, shadow, status palette, component anatomy. | Before adding any color/size/spacing value. |
| [`senior-developer.md`](./senior-developer.md) | Who you are (senior Vue/TS/Tailwind dev) and the best-practice patterns you follow. | Before writing component code. |
| [`tokens-first.md`](./tokens-first.md) | The hard rule: **always check the design-system tokens before adding a style.** | Every styling change. No exceptions. |

## Related rules

[`../frontend-writing-patterns.md`](../frontend-writing-patterns.md) is the companion: code
architecture (feature-slices, composables, services, stores), state/reactivity, forms, money
handling, and the Telegram integration. **That file owns *how the code is structured*; this folder
owns *how it looks* (tokens, component anatomy, the senior-dev styling bar).** They agree on the
design system — read both before a UI task.

## The one-paragraph summary

The design is defined in `claude-design/Study Link.dc.html` and codified in `tailwind.config.js`.
It is the **"Defiant" edition**: cool slate surfaces, one indigo action accent (`d-accent`), gold
(`d-rating`) reserved strictly for ratings/reviews, teal for completed, coral for chips/destructive.
Identity comes from motion (shimmer skeletons, `reveal` fade-ups, `press` taps), not loud color.
The Tailwind config adds the `d-*` tokens via `theme.extend` (Tailwind defaults like `rounded-full`
still work). Build chrome from the `d-*`, semantic type (`text-title-*`, `text-price`, …),
`rounded-card`, `shadow-d-toast` tokens — **never** from default palette colors
(`bg-gray-500`, `bg-blue-600`, …), which have been migrated out of the codebase.

## Migration status (read this)

The migration to the `d-*` "Defiant" system is **done** (the codebase went `telegram-*` → `sl-*`
→ `d-*`). Every `.vue` file, `src/assets/{base,main}.css`, the `ui/` primitives, and the layout
chrome use `d-*` tokens. There are **zero** `telegram-*` / `sl-*` / default-palette colors left in
`src/**/*.vue`. Status pills render through `<StatusBadge>` (`@/shared/components/ui`), driven by
`src/shared/constants/status.ts`.

Keep it that way:
- New UI uses `d-*` and the `ui/` primitives — never `telegram-*` / `sl-*`, never default
  palette colors for chrome. Gold (`d-rating`) is **ratings/reviews only**.
- Render entity statuses with `<StatusBadge :deal|:response|:service="…" />`, not hand-rolled colors.
- The legacy→new map in [`design-system.md`](./design-system.md#legacy-token-map) stays only as a
  reference if you hit old code in a branch.

> Pre-existing, unrelated TypeScript errors remain in a few files (`Select` v-model typing in
> `ServiceFilters`/`DealFilters`/`EditOrderPage`, `getMyStudentDeals`, `getActiveSubjects`,
> `useAuth` User typing). They predate the design work and are **not** styling issues — `vite build`
> succeeds; only `vue-tsc` type-check flags them.
