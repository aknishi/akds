---
"@aknishi/akds-tokens": patch
---

Add `-strong` tokens to fix non-text contrast failures:

- `--akds-color-background-primary-strong` (`#1D4ED8`) — a theme-invariant primary surface for pairing with white text/icons. Dark-mode `background-primary-default` (`#3B82F6`) was only 3.7:1 with white, below the 4.5:1 text minimum.
- `--akds-color-border-neutral-strong` (`#737373` light / `#A3A3A3` dark) — for real UI-control boundaries. `border-neutral-default` was only 1.3:1 (light) / 1.7:1 (dark), under the 3:1 minimum for UI components.

Also added `--akds-color-text-on-success-default`, `--akds-color-text-on-error-default`, and `--akds-color-text-on-warning-default` (all `#FFFFFF`, theme-invariant), alongside the existing `text-on-primary`/`text-on-secondary`. These give components a semantically correct token for text sitting on a solid success/error/warning fill (e.g. the `-strong` backgrounds above) instead of reusing `text-on-primary-default` for colors it was never meant to describe.

Also nudged `--akds-color-border-neutral-default` (light) from `#E5E5E5` to `#E2E2E2` — a deliberate visual tweak, not a contrast fix (still ~1.3:1, well under the 3:1 minimum for UI components).

`Colors.mdx` now documents all of the above, plus a new `interaction.focus.outline` row for `--akds-color-interaction-focus-outline` (and fixes two pre-existing typos in that table's `ondark` overlay variable names, which pointed at CSS variables that don't exist).
