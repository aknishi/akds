---
"@aknishi/akds-dataview": minor
---

`loading` now shows an indicator while rows are shown: the rows stay in place, faded, with a progress bar under the header (or along the top of the cards), so focus and scroll position are kept during a server-side sort, page change, or search.

Add `loadingMore` to `TableView` and `CardView`, for rows that will be added after the ones shown, such as the next page of an infinite list. It shows "Loading more…" after the last row without fading the rows, or the loading state while there are no rows yet. `loading` wins when both are set.

When rows give way to the loading or error state, the state now keeps the height of what was shown before, so the view doesn't collapse and content below it, such as `Pagination`, doesn't move.
