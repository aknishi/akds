---
"@aknishi/akds-dataview": minor
---

Add server-side data. With `serverSide`, `data` is only the current page from the server, and DataView reports sorting, search, filter, and page changes through `onQueryChange` instead of applying them itself. `rowCount` gives the server's total for the page count and row totals.

- A sort, search, or filter change returns to the first page in a single `onQueryChange` call.
- Selection carries across pages, and bulk actions get the data of every selected row, including rows selected on other pages. "Select all" isn't shown server-side.
- `Search` announces the result count when the new rows arrive.
- `Pagination` stays while a page loads or fails, so a focused page button isn't removed.
- New "Server-side data" Storybook example backed by a mock orders API.
