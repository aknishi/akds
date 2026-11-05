import React from 'react';
import type { SortingState, Table } from '@tanstack/react-table';
import { getColumnLabel } from './labels';

/**
 * Screen readers don't reliably announce an aria-sort change after a header
 * is activated, and cards have no headers at all, so the new sort is
 * announced in a live region. Shared by TableView and CardView so both
 * announce sorting the same way.
 */
export function useSortAnnouncement<TData>(table: Table<TData>, sorting: SortingState) {
  const [message, setMessage] = React.useState('');
  const prevSortingRef = React.useRef(sorting);

  React.useEffect(() => {
    // Only announce changes, never the initial sort on mount.
    if (prevSortingRef.current === sorting) return;
    prevSortingRef.current = sorting;
    const [first] = sorting;
    const column = first ? table.getColumn(first.id) : undefined;
    setMessage(
      first && column
        ? `Sorted by ${getColumnLabel(column)}, ${first.desc ? 'descending' : 'ascending'}.`
        : 'Sorting removed.',
    );
  }, [sorting, table]);

  return message;
}
