---
name: vue3-reference
description: Dense reference for the Vue 3 API surface — compiler macros (defineProps/defineEmits/defineModel/defineSlots), the full reactivity system, watchers, built-in components, provide/inject, TypeScript integration, and a list of anti-patterns. Use when you need the exact idiom for a specific Vue API, or when reviewing code for Vue anti-patterns. Complements vue-best-practices (which is the workflow); this is the lookup table.
license: MIT
metadata:
  author: github/awesome-copilot (instructions/vue.instructions.md)
  version: "1.0.0"
---

# Vue 3 reference

Read [references/vue3-standards.md](references/vue3-standards.md) — it is the full text and short
enough to load in one go.

## Study Link deltas

The upstream document targets a generic Vue 3 app. Where it disagrees with this repo, the repo wins:

- **No SSR, no Nuxt.** Skip the "SSR / Meta-frameworks" section and hydration advice entirely — this
  is a client-only Telegram Mini App.
- **No test setup.** The "Testing" section is aspirational; there is no Vitest here and
  `pnpm type-check` is the only automated verification.
- **Styling is Tailwind, not `<style scoped>`.** Ignore the styling section's CSS Modules /
  `v-bind()` in `<style>` advice — see [docs/conventions/STYLES.md](../../../docs/conventions/STYLES.md).
  Tailwind here is **v3**, so v4-only syntax does not apply.
- **Forms**: the doc's "schema library + form library" advice matches the project target —
  **vee-validate + yup**, both already installed. Do not hand-roll `validateForm()`.
- **Layering.** The doc lets components fetch data. This repo does not: components and pages go
  through composables or `services/business`, never `services/api` directly. See
  [docs/conventions/ARCHITECTURE.md](../../../docs/conventions/ARCHITECTURE.md).
- **Component naming.** The doc asks for multi-word component names; the shared UI kit here uses
  single words (`Button`, `Card`, `Input`) and stays that way.
- All user-facing strings are Russian.
