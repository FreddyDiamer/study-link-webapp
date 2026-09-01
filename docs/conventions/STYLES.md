# Styles

Trust class: `current`.

## Tailwind only

- All styling via Tailwind utility classes in templates. No `<style>` blocks in components (rare shared exceptions live in `src/assets/`, e.g. the `.input` class).
- If a `<style>` block ever does need `@apply`, it must start with `@reference '…/assets/main.css'` (a v4 requirement) and must **not** use `lang="scss"` — the Tailwind Vite plugin does not process Sass-transformed blocks, and the `@apply` silently leaks through unexpanded.
- Prefer `:class` with object syntax for conditional classes.

## Theme tokens

Use the custom `telegram-*` palette from the `@theme` block in [src/assets/main.css](../../src/assets/main.css) — never raw hex values in templates.
Tailwind is **v4**: the theme is CSS-first (`@theme` / `@theme inline`), there is no `tailwind.config.js`.

| Token | Use for |
| --- | --- |
| `telegram-bg` / `telegram-secondary` | page / secondary background |
| `telegram-card` / `telegram-input` | card and input surfaces |
| `telegram-text` / `telegram-text-secondary` | primary / muted text |
| `telegram-accent` | links, highlights |
| `telegram-button` / `telegram-button-hover` | primary buttons |
| `telegram-success` / `telegram-warning` / `telegram-destructive` | status colors |
| `telegram-border` | borders, dividers |

Example: `class="bg-telegram-card text-telegram-text border border-telegram-border rounded-xl"`.

Also available: `gradient-from`/`gradient-to` (card gradients), `custom-primary`/`custom-secondary` (CSS-var-backed, themed per flow), `shadow-telegram` / `shadow-card` / `shadow-card-hover`, animations `animate-fade-in`, `animate-slide-up`, `animate-bounce-subtle`. Font: Inter (default `font-sans`).

## Flow theming

The root element gets `flow-student` or `flow-tutor` (set from the `app` store) — flow-specific looks hang off these classes via the `custom-*` CSS variables.

## UI kit first

Before writing markup, check `@components/ui`: `Button`, `Card`, `Input`, `Select`, `Modal`, `Loader`, `Rating` (plus layout components `AppHeader`, `BottomNav` and icons in `@components/icons`). Extend the kit component rather than duplicating its markup in a feature.

Icons: inline `<svg>` or existing components in `@components/icons`. There is no icon package — `lucide-vue-next` was removed as unused.
