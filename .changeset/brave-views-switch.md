---
"@aknishi/akds-dataview": minor
---

Add `@aknishi/akds-dataview`: one data source rendered as a table or as cards, built on TanStack Table and AKDS reactkit components. `useDataView` returns `TableView`, `CardView`, `Search`, `BulkActions`, and `Pagination`, all sharing the same state. A headless layer is available at `@aknishi/akds-dataview/headless`.

**Sorting, search, and selection**

- `TableView` takes a `caption`, or `aria-label`, which names the table and the scroll region around it. The region is a tab stop, so keyboard users can scroll a wide table. `DataViewScrollArea` is a region too; name it with `aria-label`.
- Sorting is opt-in per column with `enableSorting: true`. Table headers sort on click; `CardView` has a "Sort by" menu listing every sortable column, with a "Reverse sort order" button. Sort changes are announced to screen readers.
- `Search` filters across columns and announces the result count.
- `selectable` adds row checkboxes and a "Select all shown rows" checkbox, in the table's header row and in the card view's header bar. `BulkActions` acts on the original data of every selected row.
- `getRowLabel` names rows for every row-level label, including the selection checkboxes. Defaults to the `rowHeader` column, then the first data column.
- Search, selection, page, and sort announcements go through one live region per `useDataView`, so they don't talk over each other. Headless components can share it: `useAnnounce()` from `@aknishi/akds-dataview/headless` returns the DataView's `announce`, and `useAnnouncer()` makes a region of its own.

**Cards**

- Cards sit in the same bordered frame as `TableView`, with a header bar styled like the table's header row.
- `DataViewCard` takes a `title`, plus an optional `avatar` and `subtitle` that stacks below the title. With an avatar, the checkbox, avatar, and title block center on each other; without one, the checkbox lines up with the title's first line.
- `DataViewField` shows a column's value with its label visually hidden for screen readers. `useDataViewField(column)` returns a column's `label` and rendered `value` with no markup, for visible labels in any layout (stacked, side by side, a grid, or a `<dl>`).
- `className` and other attributes go on the outer frame; `aria-label` and `aria-labelledby` name the list of cards.
- Cards off screen skip rendering until scrolled near. `--akds-dataview-card-size-estimate` (12rem by default) sets the height assumed for a card before it first renders, so the scrollbar stays steady on long lists.

**Pagination**

- Pass `pageSize` to `useDataView` and render the returned `Pagination` to show one page of rows at a time. Without `pageSize`, every row is shown.
- Shows the visible range ("11–20 of 40") and announces the new page after a page change.
- Sorting or searching returns to the first page in the same update, so an empty page never shows in between.

**Server-side data**

- With `serverSide`, `data` is only the current page, and DataView reports sorting, search, filter, and page changes through `onQueryChange` instead of applying them. `rowCount` gives the server's total.
- A sort, search, or filter change returns to the first page in a single `onQueryChange` call.
- Selection carries across pages, and bulk actions get every selected row, including rows selected on other pages. "Select all" isn't shown server-side.
- `Pagination` stays while a page loads or fails, so a focused page button isn't removed.

**Loading, error, and empty states**

- `loading` shows a loading state while there are no rows. While rows are shown, they stay in place, faded, with a progress bar under the header (or along the top of the cards), so focus and scroll position are kept. Sets `aria-busy`.
- `loadingMore` is for rows that will be added after the ones shown, such as the next page of an infinite list. It shows "Loading more…" after the last row without fading the rows. `loading` wins when both are set.
- `error` shows an error state in a `role="alert"` region. Pass a message or `true` for the default one. `onRetry` adds a "Try again" button.
- Loading wins over error, and error over empty, so only one state shows at a time.
- `loadingState`, `errorState`, and `emptyState` replace a state's layout. DataView still decides which state shows, sets `aria-busy`, announces errors, and keeps focus in place when a retry swaps the state.
- `DataViewMessage`: the icon, title, description, and action layout the default states use, for custom states that match.
- Every state has a minimum height, set by the `--akds-dataview-state-min-height` CSS variable (240px by default), so switching states doesn't make the view jump. When taller rows or cards give way to the loading or error state, the state keeps their height, so content below it, such as `Pagination`, doesn't move.

**Row and card click**

- Pass `rowClickOptions` to `TableView` or `CardView` to open an item's details, e.g. in a Drawer. `onClick` is called with the row when the row or card is clicked, or its details button is activated. Clicks on checkboxes, actions, other interactive elements, elements with `data-dataview-ignore-click`, or the end of a text selection are ignored.
- Each row and card gets a details button ("View details for {label}") for keyboard, screen reader, and touch users. It's always in the tab order, and fades in on hover or focus within, or is always shown on touch devices. `revealButtonOnHover: false` keeps it always visible.
- `renderButton` replaces the details button with any control, e.g. a "Details" text button. DataView still places it, fades it, and keeps its clicks from counting as a row click.
- `DataViewDetailsButton`: the default icon button, with a `target` (`"drawer"`, `"page"`, or `"new-tab"`) that sets a matching icon, accessible name, and tooltip, plus `icon`, `label`, and `tooltip` overrides.
