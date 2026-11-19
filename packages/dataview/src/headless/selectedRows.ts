import type { Table } from '@tanstack/react-table';

// Server-side, `data` holds only the current page, so TanStack's selected
// row model loses rows selected on other pages. Each selected row's data is
// kept here while it's on screen, so bulk actions still get every selected
// row after the user pages away.
const caches = new WeakMap<Table<any>, Map<string, unknown>>();

/** Called on every render of a server-side table. */
export function rememberSelectedRows<TData>(table: Table<TData>) {
  let cache = caches.get(table);
  if (!cache) {
    cache = new Map();
    caches.set(table, cache);
  }
  const selection = table.getState().rowSelection;
  for (const id of cache.keys()) {
    if (!selection[id]) cache.delete(id);
  }
  for (const row of table.getCoreRowModel().rows) {
    if (selection[row.id]) cache.set(row.id, row.original);
  }
}

/** The ids of every selected row, including rows not in the current data. */
export function getSelectedRowIds<TData>(table: Table<TData>): string[] {
  return Object.entries(table.getState().rowSelection)
    .filter(([, selected]) => selected)
    .map(([id]) => id);
}

/**
 * The data of every selected row. Server-side, that includes rows selected
 * on other pages; otherwise it's TanStack's selected row model.
 */
export function getSelectedOriginals<TData>(table: Table<TData>): TData[] {
  if (!table.options.manualPagination) {
    return table.getSelectedRowModel().rows.map((row) => row.original);
  }
  const cache = caches.get(table);
  return getSelectedRowIds(table).flatMap((id) => (cache?.has(id) ? [cache.get(id) as TData] : []));
}
