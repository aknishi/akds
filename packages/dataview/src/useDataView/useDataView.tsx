import React from 'react';
import type { Row, Table } from '@tanstack/react-table';
import { DataViewContext, getRowLabel as defaultGetRowLabel, useAnnouncer, useDataViewCore } from '../headless';
import { useSortAnnouncement } from '../headless/useSortAnnouncement';
import type { DataViewContextValue, UseDataViewCoreOptions } from '../headless';
import { TableView as BaseTableView } from '../TableView';
import type { TableViewProps } from '../TableView';
import { CardView as BaseCardView } from '../CardView';
import type { CardViewProps } from '../CardView';
import { Search as BaseSearch } from '../Search';
import type { SearchProps } from '../Search';
import { BulkActions as BaseBulkActions } from '../BulkActions';
import type { BulkActionsProps } from '../BulkActions';
import { Pagination as BasePagination } from '../Pagination';
import type { PaginationProps } from '../Pagination';

export type UseDataViewOptions<TData> = UseDataViewCoreOptions<TData>;

export interface UseDataViewResult<TData> {
  /** The TanStack table instance, for anything the bound views don't cover. */
  tableSource: Table<TData>;
  /** The data rendered as a table. */
  TableView: React.ComponentType<TableViewProps<TData>>;
  /** The data rendered as a list of cards. */
  CardView: React.ComponentType<CardViewProps<TData>>;
  /** A search field that filters the rows shown in both views. */
  Search: React.ComponentType<SearchProps>;
  /** The selection count and a menu of actions for the selected rows. */
  BulkActions: React.ComponentType<BulkActionsProps<TData>>;
  /** Page buttons for the rows shown in both views. Renders only with `pageSize`. */
  Pagination: React.ComponentType<PaginationProps>;
}

export function useDataView<TData>(options: UseDataViewOptions<TData>): UseDataViewResult<TData> {
  const table = useDataViewCore(options);
  // Teams usually pass getRowLabel inline, so it's read through a ref: the
  // function views call keeps its identity and never re-renders every row.
  const getRowLabelRef = React.useRef(options.getRowLabel);
  getRowLabelRef.current = options.getRowLabel;
  // One live region for the whole DataView, shared by every bound
  // component, which also announces sorting once whichever views are shown.
  const announce = useAnnouncer();
  useSortAnnouncement(table, table.getState().sorting, announce);

  // Created once per table instance (which is stable), so the returned
  // components keep their identity across renders and never remount.
  const views = React.useMemo(() => {
    const getRowLabel = (row: Row<TData>) => (getRowLabelRef.current ?? defaultGetRowLabel)(row);
    const bind = <P extends object>(Component: React.ComponentType<P>, name: string) => {
      function Bound(props: P) {
        const state = table.getState();
        // getState() returns a new object on every render, so memoize on the
        // slices DataView uses; each keeps its identity until it changes.
        const value = React.useMemo<DataViewContextValue<TData>>(
          () => ({ table, state, getRowLabel, announce }),
          [state.sorting, state.columnFilters, state.globalFilter, state.rowSelection, state.pagination],
        );
        return (
          <DataViewContext.Provider value={value}>
            <Component {...props} />
          </DataViewContext.Provider>
        );
      }
      Bound.displayName = name;
      return Bound;
    };

    return {
      TableView: bind<TableViewProps<TData>>(BaseTableView, 'TableView'),
      CardView: bind<CardViewProps<TData>>(BaseCardView, 'CardView'),
      Search: bind<SearchProps>(BaseSearch, 'Search'),
      BulkActions: bind<BulkActionsProps<TData>>(BaseBulkActions, 'BulkActions'),
      Pagination: bind<PaginationProps>(BasePagination, 'Pagination'),
    };
  }, [table]);

  return { tableSource: table, ...views };
}
