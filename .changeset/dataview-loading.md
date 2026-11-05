---
"@aknishi/akds-dataview": minor
---

Add loading, error, and empty states to `TableView` and `CardView`.

- `loading` shows a loading state while there are no rows, and sets `aria-busy`. Rows already shown stay visible while more load.
- `error` shows an error state, announced in a `role="alert"` region. Pass a message or `true` for the default one. `onRetry` adds a "Try again" button.
- Loading wins over error, and error over empty, so a state never shows alongside another.
- `loadingState`, `errorState`, and `emptyState` replace a state's layout. DataView still decides which state shows, sets `aria-busy`, announces errors, and keeps focus in place when a retry swaps the state.
- New `DataViewMessage` component: the icon, title, description, and action layout the default states use, for building custom states that match.
