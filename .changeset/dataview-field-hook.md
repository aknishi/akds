---
"@aknishi/akds-dataview": minor
---

Add `useDataViewField(column)`: returns a column's `label` and its rendered `value` for the current card's row, with no markup of its own, so cards can show visible labels in any layout (stacked, side by side, a grid, or a `<dl>`). `DataViewField` is unchanged and still hides the label visually for screen readers.
