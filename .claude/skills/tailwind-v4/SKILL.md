---
name: tailwind-v4
description: Tailwind CSS v4 in this repo — where the theme lives (CSS-first `@theme`, no config file), the v3→v4 renames, and the traps that bite in Vue SFCs (`@apply` needs `@reference`, `lang="scss"` silently breaks it). Use when adding or changing any Tailwind class, theme token, or component class.
license: MIT
metadata:
  author: "blefnk/awesome-cursor-rules (2002-tailwindcss.md), rewritten for Study Link"
  version: "1.0.0"
---

# Tailwind v4

This project runs **Tailwind 4** through `@tailwindcss/vite` (no PostCSS, no `tailwind.config.js`,
no autoprefixer). Everything theme-related lives in
[src/assets/main.css](../../../src/assets/main.css).

## Where things go

- **Design tokens** → the `@theme` block. A token named `--color-telegram-card` produces
  `bg-telegram-card`, `text-telegram-card`, `border-telegram-card`, and so on.
- **Tokens that point at a runtime CSS variable** → `@theme inline`. This is not optional:
  a plain `@theme` resolves `var(...)` once at `:root`, so a class further down the tree that
  redefines the variable has no effect. `--color-custom-primary` must stay in the `inline` block
  or per-flow theming (`.flow-student` / `.flow-tutor`) silently stops working.
- **Component classes** (`.btn`, `.card`, `.badge`, `.nav-item`) → `@layer components`. Keep them
  there rather than converting to `@utility`: the `components` layer loses to utilities, so
  `class="card p-6"` still lets `p-6` win, exactly as in v3.
- **Real utilities** (`text-gradient`, `absolute-center`, `safe-area-*`) → `@utility`, which is what
  gives them variant support (`hover:`, `md:`).

Token names are kebab-case: `telegram-text-secondary`, not `telegram-textSecondary`.

## Vue SFC traps

Both of these fail *silently* — the build succeeds and the styles just never appear:

- `@apply` inside a `<style>` block needs `@reference '../../assets/main.css'` at the top of the
  block. Without it the block cannot see the theme.
- A `<style>` block using `@apply` must **not** be `lang="scss"`. Sass transforms the block before
  the Tailwind plugin sees it, and the `@apply` passes through unexpanded into the final CSS.

Prefer putting the classes in the template and avoiding `<style>` blocks altogether.

## v3 → v4 renames already applied here

Do not reintroduce the left-hand side:

| v3 | v4 |
| --- | --- |
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `blur-sm` / `backdrop-blur-sm` | `blur-xs` / `backdrop-blur-xs` |
| `rounded` | `rounded-sm` |
| `outline-none` | `outline-hidden` |
| `bg-gradient-to-*` | `bg-linear-to-*` |
| `flex-shrink-*` / `flex-grow-*` | `shrink-*` / `grow-*` |
| `bg-opacity-50` / `text-opacity-50` | `bg-black/50` / `text-black/50` |

Other v4 behaviour changes to keep in mind: default border color is `currentcolor` (a compat shim in
`main.css` preserves the v3 look), bare `ring` is 1px (use `ring-3` for the old 3px), and the
spacing scale is generated dynamically — `p-18` and `w-88` work with no config entry.

## Conventions

- Utility classes in the template; conditional classes via `:class` with object syntax.
- Never a raw hex in a template — use a theme token.
- Repeated markup becomes a component in `@components/ui`, not a new CSS class.
