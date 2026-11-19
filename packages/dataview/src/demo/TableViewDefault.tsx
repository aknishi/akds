import React, { useMemo, useState } from 'react';
import { ActionsMenu, Avatar, DropdownMenu, Flexbox, MenuItem, Option, Tab, TabList, TabPanel, Tabs, ToggleButton, ToggleGroup, useBreakpointUp, useMediaQuery } from '@aknishi/akds-reactkit';
import { CheckCircleIcon, CopyIcon, DownloadIcon, LocalShippingIcon, PendingIcon, WarningIcon } from '@aknishi/akds-icons';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { useDataView } from '../index';
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

// Layout B shows only these columns.
const optionColumnIds = ['customer', 'status', 'total', 'trackingId', 'date'];
const optionColumns = columns.filter((column) => 'accessorKey' in column && optionColumnIds.includes(column.accessorKey as string));

// The status filter that the dropdown and the tabs both set. With no status
// selected the column filter is cleared rather than set to an empty list.
function useStatusFilter(statusColumn: Column<Order, unknown> | undefined) {
  const selected = (statusColumn?.getFilterValue() as Order['status'][] | undefined) ?? [];
  const setSelected = (next: Order['status'][]) => statusColumn?.setFilterValue(next.length > 0 ? next : undefined);
  return [selected, setSelected] as const;
}

// Search and the status dropdown: side by side on wide screens, stacked and
// full width on narrow ones.
function Toolbar({ isWide, search, statusFilter }: {
  isWide: boolean;
  search: React.ReactNode;
  statusFilter: ReturnType<typeof useStatusFilter>;
}) {
  const [selectedStatuses, setSelectedStatuses] = statusFilter;
  return (
    <Flexbox
      direction={isWide ? 'row' : 'column'}
      gap={isWide ? 'md' : 'sm'}
      align={isWide ? 'flex-end' : 'stretch'}
    >
      {search}
      <DropdownMenu
        label="Status"
        placeholder="All statuses"
        fullWidth={!isWide}
        multiple
        selected={selectedStatuses}
        onChange={(value) => setSelectedStatuses((Array.isArray(value) ? value : [value]) as Order['status'][])}
      >
        {ORDER_STATUSES.map((status) => (
          <Option key={status} value={status}>{status}</Option>
        ))}
      </DropdownMenu>
    </Flexbox>
  );
}

// Layout A's status cell: an icon and the status as text instead of a Tag.
// The icon is decorative; the text names the status.
const statusIcon: Record<Order['status'], React.ReactNode> = {
  Processing: <PendingIcon size="sm" color="info" />,
  Shipped: <LocalShippingIcon size="sm" color="success" />,
  Delayed: <WarningIcon size="sm" color="warning" />,
  Delivered: <CheckCircleIcon size="sm" />,
};

// Layout A shows every column and swaps two cell renderers. The avatar
// repeats the name next to it, so it's hidden from screen readers.
const layoutAColumns: ColumnDef<Order, any>[] = columns.map((column) => {
  if (!('accessorKey' in column)) return column;
  if (column.accessorKey === 'customer') {
    return {
      ...column,
      cell: ({ getValue }) => (
        <Flexbox align="center" gap={1}>
          <Avatar name={getValue<string>()} size="sm" aria-hidden="true" />
          {getValue<string>()}
        </Flexbox>
      ),
    };
  }
  if (column.accessorKey === 'status') {
    return {
      ...column,
      cell: ({ getValue }) => {
        const status = getValue<Order['status']>();
        return (
          <Flexbox align="center" gap={1}>
            {statusIcon[status]}
            {status}
          </Flexbox>
        );
      },
    };
  }
  return column;
});

// Layout A: search, a status filter, every column, an avatar beside each
// customer, icon-and-text statuses, and five rows per page.
function LayoutA() {
  const orders = useMemo(() => generateOrders(40), []);
  const isWide = useBreakpointUp('md');
  const bulkActionsVariant = useBulkActionsVariant();

  const { TableView, Search, BulkActions, Pagination, tableSource } = useDataView({
    data: orders,
    columns: layoutAColumns,
    getRowId: (row) => row.id,
    pageSize: 5,
  });
  const statusFilter = useStatusFilter(tableSource.getColumn('status'));

  return (
    <Flexbox direction="column" gap="sm">
      <Toolbar
        isWide={isWide}
        search={<Search label="Search orders" style={isWide ? { width: '272px' } : undefined} />}
        statusFilter={statusFilter}
      />
      <BulkActions variant={bulkActionsVariant} actions={bulkActions} />
      <TableView aria-label="Orders" selectable rowActions={(row) => <OrderActions order={row.original} />} />
      <Pagination aria-label="Orders pages" />
    </Flexbox>
  );
}

type StatusTab = 'All' | Order['status'];

// Layout B: tabs filter by status in place of search and the dropdown. Each
// tab counts its rows, read from the table so the counts follow the data.
// Five rows per page; changing tabs goes back to the first page.
function LayoutB() {
  const orders = useMemo(() => generateOrders(40), []);
  const bulkActionsVariant = useBulkActionsVariant();

  const { TableView, BulkActions, Pagination, tableSource } = useDataView({
    data: orders,
    columns: optionColumns,
    getRowId: (row) => row.id,
    pageSize: 5,
  });
  const [selectedStatuses, setSelectedStatuses] = useStatusFilter(tableSource.getColumn('status'));
  const activeTab: StatusTab = selectedStatuses[0] ?? 'All';

  // Counted before the status filter, so every tab keeps its own count
  // while another tab is active.
  const rows = tableSource.getPreFilteredRowModel().rows;
  const counts: Record<StatusTab, number> = { All: rows.length, Processing: 0, Shipped: 0, Delayed: 0, Delivered: 0 };
  rows.forEach((row) => { counts[row.getValue<Order['status']>('status')] += 1; });

  const tabs: StatusTab[] = ['All', ...ORDER_STATUSES];

  return (
    <Tabs
      activeTab={activeTab}
      onChange={(value) => setSelectedStatuses(value === 'All' ? [] : [value as Order['status']])}
    >
      <TabList aria-label="Order status">
        {tabs.map((tab) => (
          <Tab key={tab} value={tab}>{`${tab} (${counts[tab]})`}</Tab>
        ))}
      </TabList>
      {/* Only the active panel renders, so the table appears once. */}
      {tabs.map((tab) => (
        <TabPanel key={tab} value={tab}>
          <Flexbox direction="column" gap="sm">
            <BulkActions variant={bulkActionsVariant} actions={bulkActions} />
            <TableView aria-label="Orders" selectable rowActions={(row) => <OrderActions order={row.original} />} />
            <Pagination aria-label="Orders pages" />
          </Flexbox>
        </TabPanel>
      ))}
    </Tabs>
  );
}

type TableLayout = 'a' | 'b';

// Two layouts from the same orders. Each layout has its own
// useDataView, so switching layouts starts with a fresh search and filter.
export function TableViewDefault() {
  const [tableLayout, setTableLayout] = useState<TableLayout>('a');

  return (
    <Flexbox direction="column" gap="md">
      {/* A row Flexbox sizes the toggle to its content; the column would stretch it. */}
      <Flexbox>
        <ToggleGroup
          aria-label="Table layout"
          value={tableLayout}
          onChange={(value) => setTableLayout(value as TableLayout)}
        >
          <ToggleButton value="a">Layout A</ToggleButton>
          <ToggleButton value="b">Layout B</ToggleButton>
        </ToggleGroup>
      </Flexbox>

      {tableLayout === 'a' && <LayoutA />}
      {tableLayout === 'b' && <LayoutB />}
    </Flexbox>
  );
}
