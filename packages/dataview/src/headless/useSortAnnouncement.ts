import React from 'react';
import type { SortingState, Table } from '@tanstack/react-table';
import { getColumnLabel } from './labels';
import type { Announce } from './announcer';

/**
 * Screen readers don't reliably announce an aria-sort change after a header
 * is activated, and cards have no headers at all, so the new sort is
 * announced, with the number of rows it applies to. useDataView runs it
 * once for every view, so a page showing a table and cards together
 * announces each sort once. Pass `enabled: false` to skip it.
 */
export function useSortAnnouncement<TData>(
  table: Table<TData>,
  sorting: SortingState,
  announce: Announce,
  enabled = true,
) {
  const prevSortingRef = React.useRef(sorting);

  React.useEffect(() => {
    // Only announce changes, never the initial sort on mount.
    if (prevSortingRef.current === sorting) return;
    prevSortingRef.current = sorting;
    if (!enabled) return;
    const [first] = sorting;
    const column = first ? table.getColumn(first.id) : undefined;
    // Server-side, the server's total; otherwise every row the sort orders.
    const count = table.getRowCount();
    const rows = `${count} ${count === 1 ? 'row' : 'rows'}`;
    announce(
      first && column
        ? `Sorted by ${getColumnLabel(column)}, ${first.desc ? 'descending' : 'ascending'}, ${rows}.`
        : `Sorting removed, ${rows}.`,
    );
  }, [sorting, table, announce, enabled]);
}
