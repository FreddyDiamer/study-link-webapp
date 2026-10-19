# Study Link — Design System (source of truth) · "Defiant" edition

Codified in `tailwind.config.js`; raw tokens in `claude-design/tokens.css`; visual spec in
`claude-design/main-ds.html`. This file mirrors those. If they disagree, **config wins** for class
names, **tokens.css/HTML win** for values/intent — flag the drift.

> Tokens are added under `theme.extend`, so Tailwind defaults (`rounded-full`, spacing, `text-white`)
> still resolve. **The `d-*` tokens + semantic type/radius are the design system — always prefer
> them.** Never use default palette colors (`bg-blue-500`, `text-gray-600`, …) for chrome.

## Design principles

1. **Cool slate + indigo.** Dark slate surfaces, indigo (`d-accent` `#7C8CFF`) is the **only**
   action accent. No second action color.
2. **Gold is reputation-only.** `d-rating` (`#FFC247`) is reserved **exclusively** for ratings,
   stars, and reviews — so reputation always reads first. Never use gold for anything else.
3. **Reputation-forward.** Cards lead with a gold rating pill; detail/profile screens open with a
   rating "hero" (big score + star distribution bars).
4. **Responsive, not loud.** Identity comes from motion: shimmer skeletons, staggered `reveal`
   fade-ups, springy `press` taps, animated steppers/rating bars — not from bright color.
5. **Hairlines, no shadows.** Separate regions with 1px `d-border` hairlines; borders brighten to
   `d-border-hover` on hover. Shadows only on floating things (toast/modal/logo).
6. **One primary action per screen.** Money + status + rating visible on every card.
7. **Your role has a colour.** Исполнитель = `d-role-worker` (indigo), заказчик =
   `d-role-customer` (lime). Role is a property of the object, so the colour follows who *you* are
   on it: your request / someone's service → customer; your service / someone's request → worker.
   - **Labels** — role tags («Вы заказчик»), the header role prefix (`AppHeader :role`), role
     segments, the feed hint dot, «Моя» / «Вы откликнулись» pills, profile section titles,
     reputation cards — use `ROLE_META[role].text / .soft / .solid`.
   - **Actions** take the colour of the role you act in: primary buttons, field focus, picker
     selection, confirmation ticks. They use the **action colour** `d-act` (`bg-d-act`,
     `focus:border-d-act`, `text-d-act`, `.btn-primary`, `ActionButton`), which is `d-accent` by
     default and switches inside a `ROLE_META[role].scope` wrapper (`.role-worker` /
     `.role-customer`, CSS var `--d-act`). Wrap the screen by your role on the object, and wrap a
     single control when its action belongs to the other role (e.g. «Создать заявку» on the
     Заявки tab is a customer action → `.role-customer`).
   - **Stays neutral `d-accent`**: logo, `+`, tab bar, profile/settings links, toggles, toast,
     spinners, status pills («Принят», «В работе», «Новый»). Destructive stays coral, ratings
     gold, statuses teal — never use them for a role, and never hand-pick a role colour.

## Color tokens (`d-*`)

| Class | Hex | Use for |
| --- | --- | --- |
| `d-ink` | `#0E0F13` | App / screen background; **text on accent/chips** |
| `d-panel` | `#15171D` | Cards, raised blocks, inputs |
| `d-surface` | `#21252E` | Nested surfaces, tracks, segment bg, avatar chips |
| `d-border` | `#21252E` | Default 1px hairline |
| `d-border-soft` | `#2A2F3A` | Input / icon borders |
| `d-border-hover` | `#3A4150` | Card border on hover |
| `d-text` | `#E8EAED` | Primary text, headings, prices |
| `d-text-bright` | `#C9CFD8` | Review body / emphasis text |
| `d-text-second` | `#8A93A3` | Secondary text, card subline |
| `d-text-hint` | `#5B6472` | Captions, meta, placeholders, section overlines |
| `d-text-mute` | `#4B5159` | Inactive tab-bar icon/label |
| `d-accent` | `#7C8CFF` | **The** action accent: buttons, links, active states, focus border |
| `d-accent-hi` | `#9AA6FF` | Active stepper step, "В работе" status text |
| `d-rating` | `#FFC247` | **Ratings/stars/reviews ONLY** |
| `d-rating-dim` | `#A8843C` | Meta next to a rating (review count) |
| `d-role-worker` | `#7C8CFF` | Role «исполнитель» — labels/accents (same hue as accent) |
| `d-role-customer` | `#A8D96B` | Role «заказчик» — labels/accents; free of any status meaning |
| `d-teal` | `#3FB5A8` | Completed / success / active service |
| `d-coral` | `#E97A6B` | Destructive (delete/reject) + avatar chips |
| `d-sk-base` / `d-sk-hi` | `#1A1D24` / `#242833` | Skeleton gradient stops |

**Text on a colored surface (accent/coral/teal/rating chip or button) is `d-ink`, not white.**

### Status badges — one palette, driven by `src/shared/constants/status.ts`

Render via `<StatusBadge :deal|:response|:service="…" />` (`@/shared/components/ui`). Never
hand-roll. The `.badge-*` classes (in `main.css`):

| Badge class | bg / text | Statuses (RU) |
| --- | --- | --- |
| `badge-pending` | `d-rating/12` / `d-rating` | Ожидает |
| `badge-accent` | `d-accent/16` / `d-accent` | Принят / Принята |
| `badge-progress` | `d-accent/16` / `d-accent-hi` | В работе |
| `badge-teal` | `d-teal/16` / `d-teal` | Завершена / Активна |
| `badge-coral` | `d-coral/16` / `d-coral` | Отклонён / Заблокирована |
| `badge-neutral` | `d-text-mute/20` / `d-text-second` | Отменена / Истёк / Скрыта |

## Type scale (semantic; prefer over `text-sm`/`text-lg`)

| Class | Size / line-height / weight | Use for |
| --- | --- | --- |
| `text-screen-title` | 26 / 1.05 / 700 · -0.02em | Screen titles («Маркет», «Сделки») |
| `text-title-l` | 22 / 1.1 / 700 | Large headings |
| `text-title-m` | 17 / 22 / 600 | Card titles |
| `text-price` | 19 / 1 / 700 (tnum) | Price in feed |
| `text-price-lg` | 22 / 1 / 700 (tnum) | Price in detail |
| `text-rating-hero` | 38 / 0.9 / 700 (tnum) | Big rating score |
| `text-body` | 16 / 1.45 | Body, descriptions, input text |
| `text-review` | 14 / 1.45 | Review body (use with `text-d-text-bright`) |
| `text-subhead` | 14 / 19 | Secondary card line |
| `text-caption` | 13 / 16 | Meta, counts, authors |
| `text-overline` | 12 / 1 / 600 · 0.05em UPPER | Section labels (`text-d-text-hint`) |
| `text-micro` | 10 / 1 / 600 · 0.04em UPPER | Stepper/tab labels |

Font: `font-sl` (system stack). Numbers (price/rating/count) get `tnum` (tabular numerals).

## Radius (semantic)

| Class | Value | Use for |
| --- | --- | --- |
| `rounded-chip` | 9px | Small chips, avatar chips, stepper dots |
| `rounded-field` | 10px | Inputs, small buttons |
| `rounded-card` | 15px | Feed cards |
| `rounded-sheet` | 16px | Large blocks / reputation hero |
| `rounded-avatar` | 17px | Profile avatar (60px) |
| `rounded-full` | 9999px | Pills, progress tracks, badges |

Primary CTA buttons use `13px` (`rounded-[13px]`, applied by `<Button size="lg">`).

## Shadow / motion

- Shadows: `shadow-d-toast` (toast/modal/dropdown), `shadow-d-logo` (logo), `shadow-d-phone` (bezel).
  **Cards have no shadow** — `border border-d-border` only.
- Animations (in `tailwind.config.js` + `main.css`): `animate-d-shimmer` (skeleton),
  `animate-d-fadeup` / `.reveal` (staggered card entrance — add inline `animation-delay`),
  `animate-d-growx` (rating bars / stepper fill), `animate-d-toastin`, `animate-d-spin` (spinner).
- Utilities: `.reveal`, `.press` (springy active tap), `.skeleton` (shimmer plate), `.tnum`.

## Component anatomy

- **Button (primary):** `bg-d-accent text-d-ink font-bold`, `h-[52px] rounded-[13px]`
  (`<Button size="lg">`). `.btn-secondary` = `bg-d-surface text-d-text border-d-border-soft`;
  `.btn-ghost` = `text-d-accent`; `.btn-destructive` = transparent `text-d-coral`.
- **Card:** `bg-d-panel border border-d-border rounded-card p-4`, no shadow; `card-hover` brightens
  the border. Header: avatar chip + tutor name + **gold rating pill pushed right**; title
  `text-title-m`; desc `text-subhead text-d-text-second line-clamp-2`; footer price
  (`text-price tnum`) left, meta (`text-caption text-d-text-hint`) right.
- **Avatar chip:** `rounded-chip` (or `rounded-avatar` for 60px profile), per-user color
  (`d-accent` / `d-coral` / `d-teal`), **initials in `text-d-ink` font-bold**.
- **Rating pill (cards):** `bg-d-rating/12 rounded-full px-[10px] py-1`, gold star + score
  (`text-d-rating font-bold tnum`) + `· {count}` in `text-d-rating-dim`.
- **Input:** `.input` → `bg-d-panel border border-d-border-soft rounded-field`, focus
  `border-d-accent`. Money: `₽` prefix `text-d-text-hint`, value right `font-bold tnum`. Money is
  stored in **kopecks** — `/100` for display, space thousands separator (`1 500 ₽`).
- **Segment:** `.segment` track (`bg-d-panel border-d-border rounded-field p-1`); active item
  `bg-d-accent text-d-ink`.
- **Chip filter:** `.chip`; active `bg-d-accent text-d-ink`.
- **Info group:** `.info-group` + `.info-row` (hairline-divided key/value rows).
- **Tab bar:** `bg-d-panel border-t border-d-border`; active icon `d-accent`, inactive
  `d-text-mute`; label `text-micro`.
- **Skeleton:** `.skeleton` plates while loading.
- **Stepper (deals):** rounded-chip dots, `d-accent` fill bars (`animate-d-growx`).

## Legacy token map (history)

Migrated **twice**: `telegram-*` → `sl-*` (Telegram-blue) → **`d-*` (Defiant, current)**. There are
zero `telegram-*` or `sl-*` usages left. Reference only:

| Old `sl-*` | New `d-*` |
| --- | --- |
| `sl-bg` | `d-ink` |
| `sl-surface` | `d-panel` |
| `sl-bg-secondary` | `d-surface` |
| `sl-separator` | `d-border` |
| `sl-text` / `sl-text-secondary` / `sl-text-hint` | `d-text` / `d-text-second` / `d-text-hint` |
| `sl-accent` | `d-accent` |
| `sl-accent-text` (white) | `d-ink` (dark text on accent) |
| `sl-destructive` | `d-coral` |
| `status-pending/accepted/progress/rejected/neutral` | `d-rating` / `d-teal` / `d-accent(-hi)` / `d-coral` / neutral |
| `rounded-input` | `rounded-field` |
| `shadow-float` | `shadow-d-toast` |

The shared classes in `src/assets/main.css` (`.btn*`, `.card`, `.input`, `.badge*`, `.segment*`,
`.chip`, `.info-*`, `.reveal`, `.press`, `.skeleton`, `.tnum`) are built on `d-*` — use them or
compose tokens directly.
