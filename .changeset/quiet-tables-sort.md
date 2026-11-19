---
"@aknishi/akds-reactkit": minor
---

Add `VisuallyHidden`, `ActionsMenu`, and sortable `Th` headers.

- **`VisuallyHidden`**: hides content visually while keeping it available to screen readers. `Checkbox` now drops the label gap when its label is a single `VisuallyHidden`.
- **`ActionsMenu`**: an icon button with a vertical ellipsis that opens a `Menu` of `MenuItem` actions. Sets `aria-haspopup="menu"`, closes when an item is selected, and returns focus to the trigger after Escape or a selection. Pass a `Button` or `IconButton` as `trigger` to replace the default icon trigger, e.g. with a labelled button.
- **Sortable `Th`**: new `sortable`, `sortDirection`, and `onSort` props. The whole header renders as a button, `aria-sort` is set only on the sorted column, and the resize handle stays outside the button. `Th` renders exactly as before when `sortable` is not set.
