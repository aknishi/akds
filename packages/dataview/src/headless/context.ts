import { createContext, useContext } from 'react';
import type React from 'react';
import type { ReactNode } from 'react';
import type { Row, Table, TableState } from '@tanstack/react-table';
import { getRowLabel } from './labels';
import type { RowClickOptions } from './rowClickOptions';

export interface DataViewContextValue<TData = unknown> {
  table: Table<TData>;
  /**
   * The table instance keeps the same identity across renders, so state is
   * passed alongside it to make memoized consumers re-render when sorting,
   * filtering, or selection changes.
   */
  state: TableState;
  /**
   * Names a row in plain text for row-level labels: "Select {label}" and
   * "View details for {label}". Defaults to `getRowLabel`.
   */
  getRowLabel?: (row: Row<TData>) => string;
}

/** Called when a table row or card is clicked, or its details button is activated. */
export type RowClickHandler<TData> = (
  row: Row<TData>,
  event: React.MouseEvent<HTMLElement>,
) => void;

export type CardActionsPlacement = 'header' | 'footer';

export interface RowContextValue<TData = unknown> {
  row: Row<TData>;
  selectable: boolean;
  cardActions: ((row: Row<TData>) => ReactNode) | undefined;
  cardActionsPlacement: CardActionsPlacement;
  /**
   * Roving tabindex: only one card is in the tab order at a time (0), the
   * rest are -1. Arrow keys move between cards.
   */
  tabIndex: 0 | -1;
  /** CardView's rowClickOptions. When set, the card renders a details button. */
  rowClickOptions?: RowClickOptions<TData> | undefined;
}

// The contexts are untyped at runtime; the hooks below restore TData for callers.
export const DataViewContext = createContext<DataViewContextValue<any> | null>(null);
export const RowContext = createContext<RowContextValue<any> | null>(null);

export function useDataViewInstance<TData = unknown>(): DataViewContextValue<TData> {
  const ctx = useContext(DataViewContext);
  if (!ctx) {
    throw new Error('This component must be used inside a view returned by useDataView.');
  }
  return ctx;
}

/** The row naming function every view uses, so all row-level labels come from one place. */
export function useRowLabel<TData = unknown>(): (row: Row<TData>) => string {
  const ctx = useContext(DataViewContext);
  return ctx?.getRowLabel ?? getRowLabel;
}

export function useDataViewRow<TData = unknown>(): RowContextValue<TData> {
  const ctx = useContext(RowContext);
  if (!ctx) {
    throw new Error('DataViewCard and DataViewField must be used inside CardView.');
  }
  return ctx;
}
