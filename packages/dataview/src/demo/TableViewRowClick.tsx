import React, { useMemo, useState } from 'react';
import { ActionsMenu, Drawer, Flexbox, MenuItem, Text, useBreakpointUp, useMediaQuery } from '@aknishi/akds-reactkit';
import { CopyIcon, DownloadIcon } from '@aknishi/akds-icons';
import { useDataView } from '../index';
import type { BulkAction, BulkActionsVariant } from '../index';
import { columns } from './columns';
import { generateOrders } from './data';
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

export function TableViewRowClick() {
  const bulkActionsVariant = useBulkActionsVariant();
  const orders = useMemo(() => generateOrders(12), []);
  const { TableView, BulkActions, Pagination } = useDataView({
    data: orders,
    columns,
    getRowId: (row) => row.id,
    getRowLabel: (row) => row.original.customer,
    pageSize: 10,
  });
  // The order stays set while the drawer animates closed, so its title
  // doesn't disappear mid-animation.
  const [order, setOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <Flexbox direction="column" gap="sm">
      {/* Clicking a row opens its details; it never changes the selection. */}
      <BulkActions variant={bulkActionsVariant} actions={bulkActions} />
      <TableView aria-label="Orders"
        selectable
        rowClickOptions={{
          onClick: (row) => {
            setOrder(row.original);
            setOpen(true);
          },
        }}
        rowActions={(row) => <OrderActions order={row.original} />}
      />
      <Pagination aria-label="Orders pages" />
      {/* Closing returns focus to the details button that opened it. */}
      <Drawer open={open} onClose={() => setOpen(false)} side="right" title={order ? `${order.id} — ${order.customer}` : undefined}>
        <Text>Row details here</Text>
      </Drawer>
    </Flexbox>
  );
}
