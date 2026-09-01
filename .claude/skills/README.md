# Agent skills

Skills auto-loaded by Claude Code when a task matches their `description`. They are **advisory
reference material** — on conflict, [CLAUDE.md](../../CLAUDE.md) and [docs/](../../docs) win, because
they describe this repo; the skills describe Vue in general.

| Skill | Source | Modified? |
| --- | --- | --- |
| `vue-best-practices` | [vuejs-ai/skills](https://github.com/vuejs-ai/skills) (MIT) | verbatim |
| `vue-router-best-practices` | [vuejs-ai/skills](https://github.com/vuejs-ai/skills) (MIT) | frontmatter only |
| `vue-pinia-best-practices` | [vuejs-ai/skills](https://github.com/vuejs-ai/skills) (MIT) | frontmatter only |
| `vue3-reference` | [github/awesome-copilot](https://github.com/github/awesome-copilot) `instructions/vue.instructions.md` (MIT) | body verbatim in `references/`, project deltas added in `SKILL.md` |
| `typescript-strict` | [blefnk/awesome-cursor-rules](https://github.com/blefnk/awesome-cursor-rules) `1000-typescript.md` (MIT) | rewritten for this repo |
| `web-accessibility` | [github/awesome-copilot](https://github.com/github/awesome-copilot) `instructions/a11y.instructions.md` (MIT) + `blefnk` `004-accessibility.md` | body verbatim in `references/`, checklist + project notes in `SKILL.md` |

## Deliberately not added

- **vuejs-ai/skills** — `vue-testing-best-practices` (no test setup in this project),
  `vue-options-api-best-practices` and `vue-jsx-best-practices` (this repo is `<script setup>` only),
  `vue-debug-guides` (~880 KB of gotchas; add later if debugging Vue internals becomes routine),
  `create-adaptable-composable`.
- **aliarghyani/vue-cursor-rules** — nothing. Its `form-handling.mdc` teaches a hand-rolled
  `validateForm()`, which is exactly the tech debt CLAUDE.md tells us to migrate away from
  (vee-validate + yup are already installed). Its `api-integration.mdc` builds a `useFetch` on raw
  `fetch`, bypassing our `services/api` + `services/business` layering and axios client. The rest
  (pinia, composables, project-structure) is either already in CLAUDE.md or padded with
  Vuetify/Quasar/Element Plus variants we do not use.
- **PatrickJS/awesome-cursorrules** — nothing. `rules/vue.mdc` and `rules/tailwind.mdc` are lists of
  "use proper X" with no actionable content; `rules/vue-claude-stack.mdc` is Nuxt-centric and is a
  strict subset of `vue3-reference`; `rules/typescript-axios-*.mdc` is 8 lines.
- **blefnk/awesome-cursor-rules** — `2002-tailwindcss.md` documents **Tailwind v4** (CSS-first
  config, `shadow-sm`→`shadow-xs`, `@utility`); this project is on Tailwind **v3.4** with
  `tailwind.config.js`, so it would be actively wrong. `2000-react.md` / `2001-nextjs.md` /
  `300-testing-vitest.md` / server-action rules are for a different stack. `001-general-rules.md`
  encodes Cursor-specific tool names.
- **github/awesome-copilot** — `agents/vuejs-expert.agent.md` is a VS Code agent persona whose
  substance is already covered by `vue-best-practices` + `vue3-reference`;
  `instructions/tailwind-v4-vite.instructions.md` is Tailwind v4 again.

## Updating

Sources are pinned by copy, not by submodule. To refresh, re-clone the upstream repo and diff
against the copies here; re-apply the `SKILL.md` frontmatter and "Study Link deltas" sections.
