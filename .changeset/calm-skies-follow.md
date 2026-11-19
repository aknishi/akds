---
"@aknishi/akds-tokens": patch
"@aknishi/akds-reactkit": patch
---

Native UI now matches the theme, and themed subtrees, OS dark mode and Windows High Contrast render correctly:

- **tokens** — `:root` declares `color-scheme: light dark`, and `[data-theme="light"]` / `[data-theme="dark"]` set `color-scheme: light` / `dark`. Scrollbars, native form controls, and the page canvas now match the active theme instead of staying light in dark mode.
- **tokens** — added a `[data-theme="light"]` token block. A light-themed subtree inside an OS-dark (or `data-theme="dark"`) page previously inherited the dark tokens; it now renders light. Composite tokens that reference other tokens (`--akds-outline-focus`) are redeclared in each theme block, so focus rings use the right color inside themed subtrees.
- **tokens** — a themed subtree (any non-root `[data-theme]` element) now gets `background-color: var(--akds-color-surface-default)` and `color: var(--akds-color-text-primary-default)`, so text and background always come from the same scheme.
- **AIButton** — dark-mode styling for its glow, bevels, loading, and hover states now also applies when dark mode comes from the OS preference (previously only the base colors switched, leaving a half-dark button), and a light-themed subtree keeps the light treatment. Also fixed a malformed `transition` on the glow layer that was being discarded.
- **Forced colors (Windows High Contrast)** — Button, IconButton, ToggleButton, ToggleGroup, Tabs, Checkbox, Radio, Switch, and listbox options now keep visible boundaries and checked/selected/pressed states. These were drawn with `box-shadow` or background fills, which forced colors removes; they now use outlines and system colors (`Highlight`, `ButtonText`, `CanvasText`, `GrayText`).
