---
"@aknishi/akds-dataview": minor
---

Add pagination. Pass `pageSize` to `useDataView` and render the returned `Pagination` to show one page of rows at a time in `TableView` and `CardView`.

- Shows the visible range ("11–20 of 40") and announces the new page to screen readers after a page change.
- Sorting or searching returns to the first page in the same update, so an empty page never shows in between.
- Opt-in: without `pageSize`, every row is shown as before.
- The Storybook examples with more than 10 rows (except the virtualized demo) now show 10 rows per page.
