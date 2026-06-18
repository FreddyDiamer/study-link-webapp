# Rule: check the design-system tokens first — always

**Before adding any color, font size, spacing, radius, or shadow, check whether a token already
exists for it.** This is a hard rule, not a guideline. The design system is intentionally small;
every off-token value erodes it.

## The check (do this every time you style something)

1. **Look it up.** Open [`design-system.md`](./design-system.md) (the token tables) or
   `tailwind.config.js`. Is there a token for this color/size/radius/shadow?
2. **If a token exists → use it.** Never hardcode a value that has a token
   (`bg-[#15171D]` when `bg-d-panel` exists is a bug).
3. **If no token exists → stop and decide:**
   - Is this a genuinely new, reusable design value? → **Add a token**, don't inline a hex.
     Add it to `tailwind.config.js` (in the correct group: `colors.sl`, `colors.status`,
     `fontSize`, `borderRadius`, or `boxShadow`) **and** document it in `design-system.md` in the
     **same change**. Then use the token.
   - Is it a true one-off the spec dictates (e.g. an exact pixel height)? → An arbitrary value
     like `h-[50px]` is acceptable. A one-off **color or radius** almost never is — that's a token.
4. **Never add a second accent or a new status color.** One accent (`d-accent`, indigo); statuses
   come only from the `.badge-*` palette; gold (`d-rating`) is ratings/reviews only. If a design
   seems to need more, raise it — don't silently add.

## Why

- The semantic tokens are the design system. A "reasonable" default-palette guess like
  `bg-blue-600` or `text-gray-500` resolves but is **off-system** — chrome must use `d-*`.
- Consistency: the `d-*` tokens are the only thing keeping 50+ components visually coherent. A raw
  hex (or a default-palette color) is invisible to the system and drifts on the next change.

## When you can't find a token

Don't guess and don't inline. Ask (or propose in your response) what the token should be, add it to
`tailwind.config.js` + `design-system.md`, then use it. A missing token is a gap to fill, never a
license to hardcode.

## Quick self-audit before finishing

- [ ] No raw hex / rgb in templates where a `d-*` token exists.
- [ ] No default-scale classes the config removed (`text-sm`, `shadow-md`, `rounded-xl`, …).
- [ ] Any new value I needed is a **token in the config**, reflected in `design-system.md`.
- [ ] No second accent, no new status color.
