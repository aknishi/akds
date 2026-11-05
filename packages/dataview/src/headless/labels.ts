import type { Column, Row, RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    /**
     * Plain-text name for the column, used in screen-reader announcements and
     * hidden field labels. Needed when `header` is a function or an element.
     */
    ariaLabel?: string;
    /**
     * Marks the column whose value names the row (e.g. a customer name). Its
     * cells render as row headers, and its value labels the row's checkbox.
     */
    rowHeader?: boolean;
  }
}

/** The column's name as plain text: `meta.ariaLabel`, then a string `header`, then the column id. */
export function getColumnLabel<TData>(column: Column<TData, unknown>): string {
  const { meta, header } = column.columnDef;
  if (meta?.ariaLabel) return meta.ariaLabel;
  if (typeof header === 'string') return header;
  return column.id;
}

/**
 * The row's name as plain text: the value of the `rowHeader` column, then the
 * first data column, falling back to the row id. Pass `getRowLabel` to
 * useDataView to name rows another way.
 */
export function getRowLabel<TData>(row: Row<TData>): string {
  const cells = row.getAllCells();
  const cell = cells.find((c) => c.column.columnDef.meta?.rowHeader) ?? cells[0];
  const value = cell?.getValue();
  return value === undefined || value === null || value === '' ? row.id : String(value);
}
