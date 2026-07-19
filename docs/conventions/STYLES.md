# Styles

Trust class: `current`.

## Tailwind only

- All styling via Tailwind utility classes in templates. No `<style>` blocks in components (rare shared exceptions live in `src/assets/`, e.g. the `.input` class).
- Prefer `:class` with object syntax for conditional classes.

## Theme tokens

Use the custom `telegram-*` palette from [tailwind.config.js](../../tailwind.config.js) — never raw hex values in templates:

| Token | Use for |
| --- | --- |
| `telegram-bg` / `telegram-secondary` | page / secondary background |
| `telegram-card` / `telegram-input` | card and input surfaces |
| `telegram-text` / `telegram-textSecondary` | primary / muted text |
| `telegram-accent` | links, highlights |
| `telegram-button` / `telegram-buttonHover` | primary buttons |
| `telegram-success` / `telegram-warning` / `telegram-destructive` | status colors |
| `telegram-border` | borders, dividers |

Example: `class="bg-telegram-card text-telegram-text border border-telegram-border rounded-xl"`.

Also available: `gradient-from`/`gradient-to` (card gradients), `custom-primary`/`custom-secondary` (CSS-var-backed, themed per flow), `shadow-telegram` / `shadow-card` / `shadow-card-hover`, animations `animate-fade-in`, `animate-slide-up`, `animate-bounce-subtle`. Font: Inter (default `font-sans`).

## Flow theming

The root element gets `flow-student` or `flow-tutor` (set from the `app` store) — flow-specific looks hang off these classes via the `custom-*` CSS variables.

## UI kit first

Before writing markup, check `@components/ui`: `Button`, `Card`, `Input`, `Select`, `Modal`, `Loader`, `Rating` (plus layout components `AppHeader`, `BottomNav` and icons in `@components/icons`). Extend the kit component rather than duplicating its markup in a feature.

Icons: `lucide-vue-next` or existing components in `@components/icons`.
