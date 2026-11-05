import React from 'react';
import {
  functionalUpdate,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  Row,
  SortingState,
  Table,
  TableState,
  Updater,
} from '@tanstack/react-table';
import { rememberSelectedRows } from './selectedRows';

/** What a server needs to return one page of rows. */
export interface DataViewQuery {
  /** The requested page, 0-based. */
  pageIndex: number;
  /** Rows per page. */
  pageSize: number;
  /** At most one sorted column, e.g. `[{ id: 'total', desc: true }]`. Empty when unsorted. */
  sorting: SortingState;
  /** The Search text, or `undefined` when the search is empty. */
  globalFilter: string | undefined;
  /** Column filters, e.g. `[{ id: 'status', value: ['Shipped'] }]`. */
  columnFilters: ColumnFiltersState;
}

export interface UseDataViewCoreOptions<TData> {
  /** The rows to display. Keep the array reference stable (e.g. useMemo) to avoid recomputing rows every render. */
  data: TData[];
  /** TanStack column definitions. Keep the array reference stable. */
  columns: ColumnDef<TData, any>[];
  /** Returns a stable id for a row. Defaults to the row index, which breaks selection when data is re-ordered or filtered upstream. */
  getRowId?: (row: TData, index: number) => string;
  /**
   * Column ids to keep visible while the table scrolls horizontally, e.g.
   * `{ left: ['id'] }`. The selection and actions columns are always pinned.
   */
  columnPinning?: ColumnPinningState;
  /**
   * Names a row in plain text, e.g. `(row) => row.original.customer`. Used
   * for every row-level label: "Select {label}" on checkboxes and "View
   * details for {label}" on Details buttons. Defaults to the `rowHeader`
   * column's value, then the first data column's value.
   */
  getRowLabel?: (row: Row<TData>) => string;
  /**
   * Rows per page. When set, the views show one page of rows at a time and
   * the `Pagination` returned by useDataView moves between pages. When
   * omitted, every row is shown. Read once on the first render, like
   * `columnPinning`. Don't combine with a virtualizer.
   */
  pageSize?: number;
  /**
   * The server sorts, filters, and pages the rows. `data` is then only the
   * current page, already sorted and filtered; DataView keeps the sorting,
   * search, filter, and page state and reports it through `onQueryChange`.
   * Pass `pageSize` and `rowCount` with it. Read once on the first render.
   */
  serverSide?: boolean;
  /**
   * With `serverSide`, the number of rows on the server that match the
   * current search and filters. Drives the page count and the row totals.
   */
  rowCount?: number;
  /**
   * Called when the page, page size, sorting, search, or filters change,
   * with everything a server needs to return the rows. Not called on the
   * first render: fetch the first page yourself. A sort, search, or filter
   * change arrives with `pageIndex: 0`, in a single call.
   */
  onQueryChange?: (query: DataViewQuery) => void;
}

export function useDataViewCore<TData>({
  data,
  columns,
  getRowId,
  columnPinning,
  pageSize,
  serverSide = false,
  rowCount,
  onQueryChange,
}: UseDataViewCoreOptions<TData>): Table<TData> {
  // TanStack's own return to the first page after a sort or search is
  // queued for a later render (and never happens server-side), so the
  // render in between still asks for the old page: with fewer rows that
  // page is empty, and the view flashes its empty state. Going back to the
  // first page in the same update as the sort or filter change avoids that,
  // and gives onQueryChange one query instead of two. Data changes still
  // use TanStack's queued reset.
  const handleStateChange = (updater: Updater<TableState>) => {
    const prev = table.getState();
    const next = functionalUpdate(updater, prev);
    const rowsChanged =
      next.sorting !== prev.sorting ||
      next.globalFilter !== prev.globalFilter ||
      next.columnFilters !== prev.columnFilters;
    if (rowsChanged && next.pagination.pageIndex !== 0) table.setPageIndex(0);
  };
  const paged = Boolean(pageSize) || serverSide;

  const table = useReactTable({
    data,
    columns,
    // exactOptionalPropertyTypes: omit the key rather than pass undefined.
    ...(getRowId ? { getRowId } : {}),
    initialState: {
      // Teams choose pinned columns up front; there's no end-user pinning UI.
      ...(columnPinning ? { columnPinning } : {}),
      ...(pageSize ? { pagination: { pageIndex: 0, pageSize } } : {}),
    },
    getCoreRowModel: getCoreRowModel(),
    ...(paged ? { onStateChange: handleStateChange } : {}),
    ...(serverSide
      ? {
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        rowCount: rowCount ?? data.length,
      }
      : {
        // Opt-in, so getRowModel() keeps returning every row without pageSize.
        ...(pageSize ? { getPaginationRowModel: getPaginationRowModel() } : {}),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
      }),
    enableRowSelection: true,
    // TanStack makes every column sortable by default; here sorting is
    // opt-in per column with `enableSorting: true`.
    defaultColumn: { enableSorting: false },
    // One sorted column at a time, so aria-sort is only ever on one header.
    enableMultiSort: false,
    // TanStack sorts number columns descending first; ascending everywhere
    // is more predictable.
    sortDescFirst: false,
  });

  if (serverSide) rememberSelectedRows(table);

  const { pagination, sorting, globalFilter, columnFilters } = table.getState();
  const onQueryChangeRef = React.useRef(onQueryChange);
  onQueryChangeRef.current = onQueryChange;
  // Compared by identity: each slice keeps its identity until it changes.
  // Also skips the first render, and the second effect run in StrictMode.
  const prevQueryRef = React.useRef({ pagination, sorting, globalFilter, columnFilters });

  React.useEffect(() => {
    const prev = prevQueryRef.current;
    if (
      prev.pagination === pagination &&
      prev.sorting === sorting &&
      prev.globalFilter === globalFilter &&
      prev.columnFilters === columnFilters
    ) {
      return;
    }
    prevQueryRef.current = { pagination, sorting, globalFilter, columnFilters };
    onQueryChangeRef.current?.({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      globalFilter: typeof globalFilter === 'string' ? globalFilter : undefined,
      columnFilters,
    });
  }, [pagination, sorting, globalFilter, columnFilters]);

  return table;
}
