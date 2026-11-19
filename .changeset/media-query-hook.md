---
"@aknishi/akds-reactkit": minor
---

Add responsive hooks:

- `useBreakpointUp(breakpoint)` returns whether the viewport is at least a breakpoint (`md` and larger, so true at exactly 768px). `useBreakpointDown(breakpoint)` returns whether it's smaller than the breakpoint, and is always the opposite. Widths come from the `--akds-breakpoint-*` tokens.
- `useMediaQuery(query)` returns whether any CSS media query matches, for queries that aren't a breakpoint.

All three re-render when the result changes. During a server render, `useMediaQuery` and `useBreakpointUp` return `false`, and `useBreakpointDown` returns `true`.
