# Documentation index

Router for all project documentation. Start here when you need to know *what to read* before a task.

## Trust classes

| Class | Meaning |
| --- | --- |
| `current` | Authoritative — follow it. On conflict with code, the doc wins (code should be migrated). |
| `reference` | Useful context — verify against the actual code/backend before relying on details. |

## Typical tasks → what to read

| Task | Read first |
| --- | --- |
| Any coding task | [CLAUDE.md](../CLAUDE.md) (hub: rules, commands, conventions) |
| New feature / page / component | [conventions/ARCHITECTURE.md](conventions/ARCHITECTURE.md) — layers, patterns, checklist |
| UI / styling change | [conventions/STYLES.md](conventions/STYLES.md) — Tailwind tokens, UI kit |
| New API call or endpoint change | [API_INTEGRATION.md](API_INTEGRATION.md) + the API-module pattern in ARCHITECTURE.md |
| Auth-related work | Auth sections in [CLAUDE.md](../CLAUDE.md) (target pattern!) and [API_INTEGRATION.md](API_INTEGRATION.md) |
| Anything with prices | "Domain rules" in [CLAUDE.md](../CLAUDE.md) — rubles everywhere, no kopeks |
| Bug hunt | Start at the layer boundaries: component → business service → `services/api/client.ts`; check ARCHITECTURE.md error-handling flow |
| Working with subjects/teachers data | Education-store pattern in [conventions/ARCHITECTURE.md](conventions/ARCHITECTURE.md#global-reference-data-education) |
| Design-system / UI redesign work | [UI_INVENTORY.md](UI_INVENTORY.md) — screen-by-screen inventory of what the app renders today |
| Vue / Pinia / Router idiom questions, a11y of a component | Vendored agent skills in [../.claude/skills/](../.claude/skills/README.md) — Claude Code loads them automatically |

## All docs

| Doc | Class | What it is |
| --- | --- | --- |
| [../CLAUDE.md](../CLAUDE.md) | `current` | AI agent hub: stack, commands, strict rules, target patterns, known tech debt |
| [conventions/ARCHITECTURE.md](conventions/ARCHITECTURE.md) | `current` | Layered architecture: dependency rules, per-layer code patterns, new-feature checklist |
| [conventions/STYLES.md](conventions/STYLES.md) | `current` | Styling: Tailwind-only, `telegram-*` theme tokens, shared UI components |
| [API_INTEGRATION.md](API_INTEGRATION.md) | `reference` | Backend (NestJS) integration: auth flow, response envelope, prices, env vars. Endpoints themselves live in `src/services/api/` |
| [UI_INVENTORY.md](UI_INVENTORY.md) | `reference` | UI/functionality inventory of `main` (RU): screens, states, repeated patterns, current tokens, gaps — input for the design system |
| [../.claude/skills/README.md](../.claude/skills/README.md) | `reference` | Vendored agent skills (Vue 3, Vue Router, Pinia, strict TS, WCAG 2.2) — upstream sources, what was rejected and why. General Vue guidance; this repo's docs override it |

## Principles

- **One source of truth per topic.** Each rule is written once; other docs link to it instead of duplicating.
- **Target over actual.** Docs describe the target state; deviations are listed in CLAUDE.md → "Migration status" so agents don't copy tech debt.
- When you change a convention, update the owning doc in the same commit.
