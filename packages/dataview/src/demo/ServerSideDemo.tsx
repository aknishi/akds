import React, { useEffect, useRef, useState } from 'react';
import { ActionsMenu, DropdownMenu, Flexbox, MenuItem, Option, Switch, Text, useBreakpointUp, useMediaQuery } from '@aknishi/akds-reactkit';
import { CopyIcon, DownloadIcon } from '@aknishi/akds-icons';
import type { Row } from '@tanstack/react-table';
import { DataViewCard, useDataView, useDataViewField } from '../index';
import type { BulkAction, BulkActionsVariant, DataViewQuery } from '../index';
import { columns } from './columns';
import { fetchOrders } from './api';
import type { OrdersResult } from './api';
import { ORDER_STATUSES } from './data';
import type { Order } from './data';

// Bulk actions get the original data of every selected row.
const bulkActions: (BulkAction<Order> & { icon: React.ReactNode })[] = [
  { label: 'Export', icon: <DownloadIcon size="sm" />, onSelect: (rows) => console.log('export', rows) },
  { label: 'Copy', icon: <CopyIcon size="sm" />, onSelect: (rows) => console.log('copy', rows) },
];

// Row actions render in each row's actions cell. Name the menu after the row
// so every row's menu button is distinct to screen readers.
function OrderActions({ order }: { order: Order }) {
  return (
    <ActionsMenu label={`Actions for ${order.customer}`}>
      <MenuItem onClick={() => console.log('view', order.id)}>View details</MenuItem>
      <MenuItem onClick={() => console.log('cancel', order.id)}>Cancel order</MenuItem>
    </ActionsMenu>
  );
}

// Switches BulkActions by screen size: the given variant when there's room,
// a labelled menu on small screens, and the icon menu on the smallest. 600px
// isn't a breakpoint token, it's where the labelled menu button stops fitting
// beside the selection controls.
function useBulkActionsVariant(wide: 'button' | 'icon-button' = 'button'): BulkActionsVariant {
  const isWide = useBreakpointUp('md');
  const isNarrow = useMediaQuery('(max-width: 599px)');
  if (isWide) return wide;
  return isNarrow ? 'icon-menu' : 'menu';
}

// The cards stand in for the table on small screens. useDataViewField gives
// each column's label and its cell renderer's output, so values look
// identical in both views, and the card lays them out stacked, label above value.
// The fields sit in a <dl>, so <dt> and <dd> tell screen readers which value
// belongs to which label.
function OrderField({ column }: { column: string }) {
  const field = useDataViewField(column);
  if (!field) return null;
  return (
    <Flexbox direction="column" gap={0.5}>
      <Text as="dt" styleAs="label">{field.label}</Text>
      <Text as="dd">{field.value}</Text>
    </Flexbox>
  );
}

function OrderCard({ row }: { row: Row<Order> }) {
  return (
    <DataViewCard title={row.getValue<string>('customer')}>
      <Flexbox as="dl" direction="column" gap={1}>
        <OrderField column="id" />
        <OrderField column="status" />
        <OrderField column="total" />
        <OrderField column="shippingCost" />
        <OrderField column="carrier" />
        <OrderField column="trackingId" />
        <OrderField column="items" />
        <OrderField column="date" />
      </Flexbox>
    </DataViewCard>
  );
}

const PAGE_SIZE = 10;
// DataView doesn't call onQueryChange on the first render, so the first
// page is fetched with the query it starts with.
const INITIAL_QUERY: DataViewQuery = {
  pageIndex: 0,
  pageSize: PAGE_SIZE,
  sorting: [],
  globalFilter: undefined,
  columnFilters: [],
};
// Search waits for typing to pause; page, sort, and filter changes fetch right away.
const SEARCH_DELAY_MS = 300;

export function ServerSideDemo() {
  const isWide = useBreakpointUp('md');
  const bulkActionsVariant = useBulkActionsVariant();
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [result, setResult] = useState<OrdersResult>({ orders: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  // Makes every request fail, to show the error state. A ref, so switching
  // it affects the next request instead of refetching right away.
  const [simulateError, setSimulateError] = useState(false);
  const simulateErrorRef = useRef(simulateError);
  simulateErrorRef.current = simulateError;
  const lastSearchRef = useRef(query.globalFilter);

  const { TableView, CardView, Search, BulkActions, Pagination, tableSource } = useDataView({
    // Only the current page: the server has already searched, filtered, and sorted it.
    data: result.orders,
    columns,
    getRowId: (row) => row.id,
    serverSide: true,
    rowCount: result.total,
    pageSize: PAGE_SIZE,
    onQueryChange: setQuery,
  });

  useEffect(() => {
    const searchChanged = query.globalFilter !== lastSearchRef.current;
    lastSearchRef.current = query.globalFilter;
    // A newer query cancels this one, so a slow response can never replace
    // the rows of a later request.
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      setError(false);
      fetchOrders(query, { fail: simulateErrorRef.current })
        .then((next) => {
          if (!cancelled) setResult(next);
        })
        .catch(() => {
          // Clears the rows so the view shows its error state, but keeps the
          // total, so Pagination stays put and can still be used to retry.
          if (!cancelled) {
            setResult((prev) => ({ orders: [], total: prev.total }));
            setError(true);
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, searchChanged ? SEARCH_DELAY_MS : 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, attempt]);

  // The status filter is sent to the server like any other column filter.
  const statusColumn = tableSource.getColumn('status');
  const selectedStatuses = (statusColumn?.getFilterValue() as Order['status'][] | undefined) ?? [];
  const handleStatusChange = (value: string | string[]) => {
    const next = Array.isArray(value) ? value : [value];
    statusColumn?.setFilterValue(next.length > 0 ? next : undefined);
  };

  const states = {
    loading,
    error: error ? 'Couldn’t load orders.' : undefined,
    onRetry: () => setAttempt((n) => n + 1),
  };

  return (
    <Flexbox direction="column" gap="sm">
      <Switch
        label="Simulate network errors"
        checked={simulateError}
        onChange={(e) => setSimulateError(e.target.checked)}
      />
      <Flexbox
        direction={isWide ? 'row' : 'column'}
        gap={isWide ? 'md' : 'sm'}
        align={isWide ? 'flex-start' : 'stretch'}
      >
        <Search label="Search orders" style={isWide ? { width: '272px' } : undefined} />
        <DropdownMenu
          label="Status"
          placeholder="All statuses"
          fullWidth={!isWide}
          multiple
          selected={selectedStatuses}
          onChange={handleStatusChange}
        >
          {ORDER_STATUSES.map((status) => (
            <Option key={status} value={status}>{status}</Option>
          ))}
        </DropdownMenu>
      </Flexbox>
      <BulkActions variant={bulkActionsVariant} actions={bulkActions} />

      {isWide ? (
        <TableView selectable rowActions={(row) => <OrderActions order={row.original} />} {...states} />
      ) : (
        <CardView selectable cardActions={(row) => <OrderActions order={row.original} />} {...states}>
          {(row) => <OrderCard row={row} />}
        </CardView>
      )}
      <Pagination aria-label="Orders pages" />
    </Flexbox>
  );
}
