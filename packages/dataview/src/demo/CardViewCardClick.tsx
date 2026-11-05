import React, { useMemo, useState } from 'react';
import { ActionsMenu, Drawer, Flexbox, MenuItem, Tag, Text, useBreakpointUp, useMediaQuery, VisuallyHidden } from '@aknishi/akds-reactkit';
import { CopyIcon, DownloadIcon } from '@aknishi/akds-icons';
import type { Row } from '@tanstack/react-table';
import { DataViewCard, useDataView } from '../index';
import type { BulkAction, BulkActionsVariant } from '../index';
import { columns, statusVariant } from './columns';
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

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
// Dates are stored as 'YYYY-MM-DD'; format in UTC so the day never shifts.
const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const formatShipping = (cost: number) => (cost === 0 ? 'Free' : currency.format(cost));

function TrackingLink({ trackingId }: { trackingId: string }) {
  return (
    <a href={`https://example.com/track/${trackingId}`} target="_blank" rel="noopener noreferrer">
      {trackingId}
      <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
    </a>
  );
}

// One term and its value, side by side. Inside a <dl>, <dt> and <dd> tell
// screen readers which value belongs to which label.
function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Flexbox justify="space-between" align="baseline" gap={2}>
      <Text as="dt" styleAs="label">{label}</Text>
      <Text as="dd">{children}</Text>
    </Flexbox>
  );
}

// Team A: every field as a label and value, formatted their own way
// straight from row.original
function TeamACard({ row }: { row: Row<Order> }) {
  const order = row.original;
  return (
    <DataViewCard title={order.customer}>
      <Flexbox as="dl" direction="column" gap={1}>
        <Detail label="Order">{order.id}</Detail>
        <Detail label="Status"><Tag variant={statusVariant[order.status]} size="sm">{order.status}</Tag></Detail>
        <Detail label="Total">{currency.format(order.total)}</Detail>
        <Detail label="Shipping">{formatShipping(order.shippingCost)}</Detail>
        <Detail label="Carrier">{order.carrier}</Detail>
        <Detail label="Tracking"><TrackingLink trackingId={order.trackingId} /></Detail>
        <Detail label="Items">{order.items}</Detail>
        <Detail label="Date">{shortDate.format(new Date(order.date))}</Detail>
        <Detail label="Notes">{order.notes}</Detail>
      </Flexbox>
    </DataViewCard>
  );
}

export function CardViewCardClick() {
  const bulkActionsVariant = useBulkActionsVariant();
  const orders = useMemo(() => generateOrders(12), []);
  const { CardView, BulkActions, Pagination } = useDataView({
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
      {/* Clicking a card opens its details; it never changes the selection. */}
      <BulkActions variant={bulkActionsVariant} actions={bulkActions} />
      <CardView
        selectable
        rowClickOptions={{
          onClick: (row) => {
            setOrder(row.original);
            setOpen(true);
          },
        }}
        cardActions={(row) => <OrderActions order={row.original} />}
      >
        {(row) => <TeamACard row={row} />}
      </CardView>
      <Pagination aria-label="Orders pages" />
      {/* Closing returns focus to the details button that opened it. */}
      <Drawer open={open} onClose={() => setOpen(false)} side="right" title={order ? `${order.id} — ${order.customer}` : undefined}>
        <Text>Row details here</Text>
      </Drawer>
    </Flexbox>
  );
}
