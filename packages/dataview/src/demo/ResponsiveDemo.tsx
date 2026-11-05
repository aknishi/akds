import React, { useMemo } from 'react';
import { ActionsMenu, DropdownMenu, Flexbox, MenuItem, Option, Text, useBreakpointUp, useMediaQuery } from '@aknishi/akds-reactkit';
import { CopyIcon, DownloadIcon } from '@aknishi/akds-icons';
import type { Row } from '@tanstack/react-table';
import { DataViewCard, useDataView, useDataViewField } from '../index';
import type { BulkAction, BulkActionsVariant } from '../index';
import { columns } from './columns';
import { generateOrders, ORDER_STATUSES } from './data';
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
// identical in both views, and the card lays them out side by side.
// The fields sit in a <dl>, so <dt> and <dd> tell screen readers which value
// belongs to which label.
function OrderField({ column }: { column: string }) {
  const field = useDataViewField(column);
  if (!field) return null;
  return (
    <Flexbox justify="space-between" align="baseline" gap={2}>
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

export function ResponsiveDemo() {
  const orders = useMemo(() => generateOrders(40), []);
  const isWide = useBreakpointUp('md');
  const bulkActionsVariant = useBulkActionsVariant();

  const { TableView, CardView, Search, BulkActions, Pagination, tableSource } = useDataView({
    data: orders,
    columns,
    getRowId: (row) => row.id,
    pageSize: 10,
  });

  // A team-built filter using TanStack's column filter API directly. The
  // filter value lives in table state, so the table and cards both follow it.
  const statusColumn = tableSource.getColumn('status');
  const selectedStatuses = (statusColumn?.getFilterValue() as Order['status'][] | undefined) ?? [];
  const handleStatusChange = (value: string | string[]) => {
    const next = Array.isArray(value) ? value : [value];
    // Clearing the filter (undefined) rather than filtering by an empty list.
    statusColumn?.setFilterValue(next.length > 0 ? next : undefined);
  };

  return (
    <Flexbox direction="column" gap="sm">
      {/* The team owns this layout: side by side above the table, stacked
          and full width above the cards. */}
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
        <TableView selectable rowActions={(row) => <OrderActions order={row.original} />} />
      ) : (
        <CardView selectable cardActions={(row) => <OrderActions order={row.original} />}>
          {(row) => <OrderCard row={row} />}
        </CardView>
      )}
      {/* Shared by both views, so the page is kept when switching layouts. */}
      <Pagination aria-label="Orders pages" />
    </Flexbox>
  );
}
