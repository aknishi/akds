---
"@aknishi/akds-reactkit": minor
---

Add `useContainerBreakpointUp`, `useContainerBreakpointDown`, and `useContainerWidth`: the breakpoint hooks for an element's width instead of the viewport's, so a component switches layout whenever it's narrow, in a sidebar or a split view as well as on a phone. The breakpoint hooks re-render only when the breakpoint is crossed; `useContainerWidth` returns the width in pixels for other thresholds. Both measure before the first paint and are safe in a server render.
