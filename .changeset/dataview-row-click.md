---
"@aknishi/akds-dataview": minor
---

Add row and card click. Pass `rowClickOptions` to `TableView` or `CardView` to open an item's details, e.g. in a Drawer. Both views take the same options.

- `onClick` is called with the row when the row or card is clicked, or its details button is activated. Clicks on checkboxes, actions, other interactive elements, elements with `data-dataview-ignore-click`, or the end of a text selection are ignored.
- Each row and card gets a details button ("View details for {label}", with a panel icon) for keyboard, screen reader, and touch users. It's always in the tab order, and fades in on hover or focus within, or is always shown on touch devices. `revealButtonOnHover: false` keeps it always visible.
- `renderButton` replaces the details button with any control, e.g. a "Details" text button. It receives the row, its label, and an `onClick` that opens it; DataView still places it, fades it, and keeps its clicks from counting as a row click.
- New `DataViewDetailsButton` component: the default icon button, with a `target` (`"drawer"`, `"page"`, or `"new-tab"`) that sets a matching icon, accessible name, and tooltip, plus `icon`, `label`, and `tooltip` overrides.
- New `getRowLabel` option on `useDataView` names rows for every row-level label, including the selection checkboxes. Defaults to the `rowHeader` column, then the first data column.
