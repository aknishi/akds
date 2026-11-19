import type React from 'react';
import { flexRender } from '@tanstack/react-table';
import { getColumnLabel, useDataViewRow } from '../headless';

export interface DataViewFieldParts {
  /** The column's plain-text name: `meta.ariaLabel`, then a string `header`. */
  label: string;
  /** The column's `cell` rendered for the current row, as in the table. */
  value: React.ReactNode;
}

/**
 * Returns a column's label and rendered value for the current card's row, to
 * lay out however the card needs: stacked, side by side, or in a `<dl>`.
 * Returns null for an unknown column. When you render the label visibly,
 * keep it next to its value; for a value without a visible label, use
 * DataViewField, which gives screen readers the label.
 */
export function useDataViewField(column: string): DataViewFieldParts | null {
  const { row } = useDataViewRow();
  const cell = row.getAllCells().find((c) => c.column.id === column);
  if (!cell) return null;
  return {
    label: getColumnLabel(cell.column),
    value: flexRender(cell.column.columnDef.cell, cell.getContext()),
  };
}
