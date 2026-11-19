import React, { useMemo, useRef } from 'react';
import { ActionsMenu, DropdownMenu, Flexbox, MenuItem, Option, Tag, Text, VisuallyHidden, useContainerBreakpointUp, useContainerWidth } from '@aknishi/akds-reactkit';
import { CopyIcon, DownloadIcon } from '@aknishi/akds-icons';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { DataViewCard, useDataView, useDataViewField } from '../index';
import type { BulkAction, BulkActionsProps, BulkActionsVariant } from '../index';

interface Order {
  id: string;
  customer: string;
  status: 'Processing' | 'Shipped' | 'Delayed' | 'Delivered';
  total: number;
  /** 0 when shipping is free. */
  shippingCost: number;
  trackingId: string;
  date: string;
  items: number;
  carrier: string;
  notes: string;
}

const FIRST_NAMES = ['Hanako', 'Kenji', 'Maria', 'Liam', 'Aisha', 'Noah', 'Yuki', 'Sofia', 'Mateo', 'Chloe', 'Ravi', 'Emma', 'Daniel', 'Mei', 'Omar', 'Grace'];
const LAST_NAMES = ['Sato', 'Ito', 'Garcia', 'Chen', 'Okafor', 'Müller', 'Tanaka', 'Rossi', 'Silva', 'Martin', 'Patel', 'Kim', 'Nguyen', 'Johansson', 'Haddad', 'Walsh'];
// In the order an order moves through them, which is also how they sort.
const ORDER_STATUSES: Order['status'][] = ['Processing', 'Shipped', 'Delayed', 'Delivered'];
const CARRIERS = ['DHL', 'USPS', 'UPS'];
const NOTES = [
  'Leave at the front desk.',
  'Gift wrap requested.',
  'Customer asked for a call before delivery.',
  'Fragile — ceramic items.',
  'Deliver after 6 pm.',
  'No notes.',
];

// Seeded PRNG (mulberry32) so the demo looks identical on every run.
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SHIPPING_RATES = [4.99, 7.99, 12.99];

function generateOrders(count: number): Order[] {
  const random = createRandom(1024);
  // A separate sequence for fields added later, so adding them didn't change
  // the existing fields of any order.
  const extraRandom = createRandom(2048);
  const pick = <T,>(list: readonly T[]): T => list[Math.floor(random() * list.length)] as T;
  const start = Date.UTC(2026, 6, 1);

  return Array.from({ length: count }, (_, index) => {
    const day = new Date(start + Math.floor(random() * 90) * 86_400_000);
    const order = {
      id: `ORD-${1024 + index}`,
      customer: index === 0 ? 'Hanako Sato' : `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      status: pick(ORDER_STATUSES),
      total: Math.round((15 + random() * 485) * 2) / 2,
      date: day.toISOString().slice(0, 10),
      items: 1 + Math.floor(random() * 8),
      carrier: pick(CARRIERS),
      notes: pick(NOTES),
    };
    return {
      ...order,
      // Free shipping on orders of $250 or more
      shippingCost: order.total >= 250 ? 0 : SHIPPING_RATES[Math.floor(extraRandom() * SHIPPING_RATES.length)] as number,
      trackingId: `TRK${String(Math.floor(extraRandom() * 1e10)).padStart(10, '0')}`,
    };
  });
}

// Tag colors for each status, shared with the card layouts so they match the table.
const statusVariant = {
  Processing: 'info',
  Shipped: 'success',
  Delayed: 'warning',
  Delivered: 'default',
} as const;

const columns: ColumnDef<Order, any>[] = [
  { accessorKey: 'id', header: 'Order' },
  // rowHeader: the customer names the row, for screen readers and checkbox labels
  { accessorKey: 'customer', header: 'Customer', enableSorting: true, meta: { rowHeader: true } },
  {
    accessorKey: 'status',
    header: 'Status',
    // Sorts by progress (Processing first, Delivered last), not alphabetically.
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) =>
      ORDER_STATUSES.indexOf(rowA.getValue(columnId)) - ORDER_STATUSES.indexOf(rowB.getValue(columnId)),
    // Defined once: identical in the table and in every card layout
    cell: ({ getValue }) => {
      const status = getValue<Order['status']>();
      return <Tag variant={statusVariant[status]} size="sm">{status}</Tag>;
    },
    // The status dropdown filters with a list of statuses; a row matches if
    // its status is any of them.
    filterFn: (row, columnId, selected: Order['status'][]) => selected.includes(row.getValue(columnId)),
  },
  {
    accessorKey: 'total',
    header: 'Total',
    enableSorting: true,
    cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
  },
  {
    accessorKey: 'shippingCost',
    header: 'Shipping',
    enableSorting: true,
    cell: ({ getValue }) => {
      const cost = getValue<number>();
      return cost === 0 ? 'Free' : `$${cost.toFixed(2)}`;
    },
  },
  { accessorKey: 'carrier', header: 'Carrier' },
  {
    accessorKey: 'trackingId',
    header: 'Tracking',
    // A link inside a row: clicking it follows the link instead of counting
    // as a row click. The URL is a placeholder.
    cell: ({ getValue }) => {
      const trackingId = getValue<string>();
      return (
        <a href={`https://example.com/track/${trackingId}`} target="_blank" rel="noopener noreferrer">
          {trackingId}
          <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
        </a>
      );
    },
  },
  { accessorKey: 'items', header: 'Items', enableSorting: true },
  { accessorKey: 'date', header: 'Date', enableSorting: true },
];

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

// Switches BulkActions by the space it has: buttons when there's room, a
// labelled menu when narrower, and the icon menu when narrowest. 768px
// matches the md breakpoint; 600px isn't a breakpoint, it's where the
// labelled menu stops fitting beside the selection controls. It measures its
// own wrapper, so only this component re-renders as the width changes.
function ResponsiveBulkActions({ BulkActions }: { BulkActions: React.ComponentType<BulkActionsProps<Order>> }) {
  const ref = useRef<HTMLDivElement>(null);
  // Before the first measurement, assume the wide layout.
  const width = useContainerWidth(ref) ?? 768;
  let variant: BulkActionsVariant = 'icon-menu';
  if (width >= 768) variant = 'button';
  else if (width >= 600) variant = 'menu';
  return (
    <div ref={ref}>
      <BulkActions variant={variant} actions={bulkActions} />
    </div>
  );
}

// The cards stand in for the table when the demo is narrow. useDataViewField gives
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
  // The demo's own width, not the window's, so it switches to cards whenever
  // it's narrow: in a sidebar or a split view as well as on a phone. It only
  // re-renders when the width crosses md.
  const containerRef = useRef<HTMLDivElement>(null);
  const isWide = useContainerBreakpointUp(containerRef, 'md', { initialValue: true });

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
    <Flexbox ref={containerRef} direction="column" gap="sm">
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
      <ResponsiveBulkActions BulkActions={BulkActions} />

      {isWide ? (
        <TableView aria-label="Orders" selectable rowActions={(row) => <OrderActions order={row.original} />} />
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
