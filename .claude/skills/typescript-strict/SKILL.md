---
name: typescript-strict
description: Strict-TypeScript rules for this repo — no `any`, no non-null assertions, `??` over `||`, `as const`, throwing real Errors, ESM-only imports. Use when writing or reviewing any .ts file or the `<script setup lang="ts">` block of a component.
license: MIT
metadata:
  author: "blefnk/awesome-cursor-rules (1000-typescript.md), adapted for Study Link"
  version: "1.0.0"
---

# Strict TypeScript

`tsconfig` runs in strict mode and `pnpm type-check` (`vue-tsc --build`) is the only automated
verification in this project — treat a type error as a build failure, never as a warning to silence.

## Rules

- **No `any`, no `@ts-ignore`.** Use `unknown` plus narrowing, or a generic, or a precise type.
  If a `@ts-expect-error` is genuinely unavoidable, it needs a comment saying why.
- **No non-null assertions** (`!`) and no redundant `?.!`. Narrow instead, or return early.
- **Prefer `??` over `||`** for defaults — `||` swallows `0` and `''`, which matters for prices and
  for form fields.
- **Use optional chaining** (`?.`) on anything that can legitimately be absent.
- **`as const`** for literal object/array shapes you want narrowed (route tables, option lists,
  `STORAGE_KEYS`-style maps).
- **Avoid type assertions** (`as`) unless there is no other way; a type guard is almost always the
  better answer.
- **Throw `Error` instances**, never strings or bare objects. Custom error classes are the one place
  OOP is welcome.
- **Always handle promises** — `await` them or chain `.then()`/`.catch()`. No floating promises.
- **ESM only**: `import`, never `require()`.
- **No `eval()`** or other dynamic code execution.
- Remove unused variables, imports and expressions rather than leaving them for later.
- Prefer `T[]` over `Array<T>` constructors; keep enums and union members free of duplicates.
- Namespaces only for declaration merging; never `module`.
- Favour plain functions and `const fn = () => {}` over classes.
- Skip redundant annotations where inference is already exact
  (`const isReady = true`, not `const isReady: boolean = true`).

## Where types live

- Shared/domain types: `src/shared/types/`.
- Feature-local types stay inside the feature folder.

## Examples

```ts
// good
const parseData = (data: unknown): string | null => (typeof data === 'string' ? data : null)

// bad
function parseData(data: any): any {
  return data
}
```

```ts
// good — `0` survives
const price = order.price ?? defaultPrice

// bad — `0` becomes defaultPrice
const price = order.price || defaultPrice
```
