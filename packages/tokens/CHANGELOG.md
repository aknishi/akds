# @aknishi/akds-tokens

## 2.2.0

### Minor Changes

- fec162d: Add z-index tokens for the stacking order of page-level layers: `--akds-z-index-base` (0), `--akds-z-index-sticky` (100), `--akds-z-index-modal` (300), `--akds-z-index-popover` (400), `--akds-z-index-toast` (500), and `--akds-z-index-tooltip` (600). Also exported from JS as `zIndex` and `cssVars.zIndex`. A new "Z-index" docs page explains the layers and when a component should keep its stacking local with `isolation: isolate`.

### Patch Changes

- Raise `--akds-color-text-placeholder-default` contrast: it now maps to neutral-500 (`#737373`) in light mode and neutral-400 (`#A3A3A3`) in dark mode. The two modes were swapped before, so placeholders were too faint in both.

## 2.1.2

### Patch Changes

- 4616f5f: Native UI now matches the theme, and themed subtrees, OS dark mode and Windows High Contrast render correctly:

  - **tokens** — `:root` declares `color-scheme: light dark`, and `[data-theme="light"]` / `[data-theme="dark"]` set `color-scheme: light` / `dark`. Scrollbars, native form controls, and the page canvas now match the active theme instead of staying light in dark mode.
  - **tokens** — added a `[data-theme="light"]` token block. A light-themed subtree inside an OS-dark (or `data-theme="dark"`) page previously inherited the dark tokens; it now renders light. Composite tokens that reference other tokens (`--akds-outline-focus`) are redeclared in each theme block, so focus rings use the right color inside themed subtrees.
  - **tokens** — a themed subtree (any non-root `[data-theme]` element) now gets `background-color: var(--akds-color-surface-default)` and `color: var(--akds-color-text-primary-default)`, so text and background always come from the same scheme.
  - **AIButton** — dark-mode styling for its glow, bevels, loading, and hover states now also applies when dark mode comes from the OS preference (previously only the base colors switched, leaving a half-dark button), and a light-themed subtree keeps the light treatment. Also fixed a malformed `transition` on the glow layer that was being discarded.
  - **Forced colors (Windows High Contrast)** — Button, IconButton, ToggleButton, ToggleGroup, Tabs, Checkbox, Radio, Switch, and listbox options now keep visible boundaries and checked/selected/pressed states. These were drawn with `box-shadow` or background fills, which forced colors removes; they now use outlines and system colors (`Highlight`, `ButtonText`, `CanvasText`, `GrayText`).

## 2.1.1

### Patch Changes

- 3608ceb: Add `-strong` tokens to fix non-text contrast failures:

  - `--akds-color-background-primary-strong` (`#1D4ED8`) — a theme-invariant primary surface for pairing with white text/icons. Dark-mode `background-primary-default` (`#3B82F6`) was only 3.7:1 with white, below the 4.5:1 text minimum.
  - `--akds-color-border-neutral-strong` (`#737373` light / `#A3A3A3` dark) — for real UI-control boundaries. `border-neutral-default` was only 1.3:1 (light) / 1.7:1 (dark), under the 3:1 minimum for UI components.

  Also added `--akds-color-text-on-success-default`, `--akds-color-text-on-error-default`, and `--akds-color-text-on-warning-default` (all `#FFFFFF`, theme-invariant), alongside the existing `text-on-primary`/`text-on-secondary`. These give components a semantically correct token for text sitting on a solid success/error/warning fill (e.g. the `-strong` backgrounds above) instead of reusing `text-on-primary-default` for colors it was never meant to describe.

  Also nudged `--akds-color-border-neutral-default` (light) from `#E5E5E5` to `#E2E2E2` — a deliberate visual tweak, not a contrast fix (still ~1.3:1, well under the 3:1 minimum for UI components).

  `Colors.mdx` now documents all of the above, plus a new `interaction.focus.outline` row for `--akds-color-interaction-focus-outline` (and fixes two pre-existing typos in that table's `ondark` overlay variable names, which pointed at CSS variables that don't exist).

- 3608ceb: Fix akds-outline-focus having insufficient contrast in dark mode

## 2.1.0

### Minor Changes

- 6a913c7: Add surface status color tokens
- c5e53c1: Add background status strong color tokens for dark surface status colors.

### Patch Changes

- 6a913c7: Update value of red 600 to meet ADA contrast ratio
- 02fbb08: Fix focus outline token for dark mode

## 2.0.0

### Major Changes

- 2dbfb06: Rename spacing tokens and rename 'default' variant to 'neutral'.
  Add new '--akds-color-icon-neutral-default' token

## 1.0.0

### Major Changes

- Initial public release
