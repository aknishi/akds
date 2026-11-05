---
"@aknishi/akds-dataview": minor
---

Add sorting to `CardView`. Cards now sit in the same bordered frame as `TableView`, with a header bar styled like the table's header row.

- A "Sort by" menu lists every sortable column, with a "Reverse sort order" button next to it. Sorting is shared with `TableView`, and sort changes are announced to screen readers.
- With `selectable`, the header bar also has a "Select all shown rows" checkbox, like the table's header.
- `className` and other attributes now go on the outer frame and are kept when there are no results. `aria-label` and `aria-labelledby` still name the list of cards.
