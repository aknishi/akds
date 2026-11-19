---
"@aknishi/akds-reactkit": patch
---

Overlays now use the new `--akds-z-index-*` tokens, so they stack consistently:

- `Menu` (and so `ActionsMenu`) is on the popover layer. It previously had no z-index, so content with any positive z-index, such as a sticky table column, could cover it.
- Menus, dropdowns, and combobox lists opened inside a `Dialog` or `Drawer` now appear above it (popover, 400, is above modal, 300).
- `Dialog` and `Drawer` use the modal layer, `Toast` the toast layer, and `Tooltip` the tooltip layer.

The numeric values changed (for example `Dialog` from 1000 to 300). If your app positions its own elements relative to the old values, use the `--akds-z-index-*` tokens instead.
