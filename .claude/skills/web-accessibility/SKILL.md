---
name: web-accessibility
description: WCAG 2.2 AA rules with a catalogue of concrete anti-patterns (semantic HTML, ARIA, keyboard and focus, forms, color and contrast) plus Vue-specific ones. Use when building or reviewing any user-facing markup — modals, forms, custom controls, icon-only buttons, list and card UI.
license: MIT
metadata:
  author: "github/awesome-copilot (instructions/a11y.instructions.md) + blefnk/awesome-cursor-rules (004-accessibility.md)"
  version: "1.0.0"
---

# Accessibility

## Quick checklist

Apply on every component and page:

- Semantic HTML first — `<button>`, `<a>`, `<label>`, real heading levels, lists. ARIA only fills
  gaps semantics cannot.
- Every interactive control is reachable by keyboard and has a **visible focus state**.
- Every form field has a `<label>` (or `aria-label`), and errors are tied to the field with
  `aria-describedby` — not colour alone.
- Icon-only controls get an accessible name (`aria-label`) — in Russian, like the rest of the UI.
- Text contrast ≥ 4.5:1 (3:1 for large text and for UI component boundaries).
- Colour is never the only carrier of meaning (status badges need text or an icon too).
- Modals trap focus, close on `Escape`, and return focus to the trigger; focus is managed on route
  changes.
- Touch targets ≥ 24×24 CSS px — this is a phone-first Telegram Mini App.

## Full reference

[references/wcag-2.2-antipatterns.md](references/wcag-2.2-antipatterns.md) — the WCAG 2.2 AA
criteria table, the five rules of ARIA, and ~38 anti-patterns each with severity, how to detect it,
the WCAG criterion, and a corrected example.

Jump straight to these sections when relevant:

- `Semantic HTML Anti-Patterns (S1-S8)`
- `Keyboard and Focus Anti-Patterns (K1-K7)` — the ones that bite most often here
- `Form Anti-Patterns (F1-F6)` — order forms, service forms, auth
- `Framework-Specific: Vue (VU1-VU3)` — `@click` on a `<div>`, `v-if` toggles without focus
  management, `v-html`
- `Color Contrast Quick Reference`

Skip the React/Next.js and Angular sections — they do not apply.

## Study Link notes

- The app runs inside Telegram's webview on mobile. Keyboard navigation matters less than on
  desktop, but focus management, touch target size, contrast and labelling all still apply — and
  Telegram Desktop does give users a real keyboard.
- Shared primitives live in `@components/ui` (`Button`, `Input`, `Select`, `Modal`, …). Fix
  accessibility **there** rather than patching each call site; a fix in `Modal` fixes every dialog.
- The legal-enforcement section of the reference is US/EU context and is informational only.
