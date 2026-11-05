import React, { useMemo, useState } from 'react';
import { Button, Drawer, Flexbox, Tag, Text, VisuallyHidden } from '@aknishi/akds-reactkit';
import type { Row } from '@tanstack/react-table';
import { DataViewCard, DataViewDetailsButton, useDataView } from '../index';
import type { RowClickOptions } from '../index';
import { columns, statusVariant } from './columns';
import { generateOrders } from './data';
import type { Order } from './data';

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

// renderButton replaces the default details button. Whatever it renders,
// DataView still places it, fades it in on hover (unless
// revealButtonOnHover is false), and keeps its clicks from also counting as
// a row click.
export function RowClickCustomButton() {
  const orders = useMemo(() => generateOrders(4), []);
  const { TableView, CardView } = useDataView({
    data: orders,
    columns,
    getRowId: (row) => row.id,
    getRowLabel: (row) => row.original.customer,
  });
  const [order, setOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);

  // A text button, always visible. Its accessible name includes the row's
  // label, so every row's button is distinct to screen readers.
  const textButton: RowClickOptions<Order> = {
    onClick: (row) => {
      setOrder(row.original);
      setOpen(true);
    },
    renderButton: ({ rowLabel, onClick }) => (
      <Button size="sm" appearance="bordered" onClick={onClick} aria-label={`Details for ${rowLabel}`}>
        Details
      </Button>
    ),
    revealButtonOnHover: false,
  };

  // The standard icon button, for details that open in a new tab: the
  // target sets a matching icon, name ("… in a new tab"), and tooltip.
  const newTab: RowClickOptions<Order> = {
    onClick: (row) => {
      window.open(`https://example.com/?order=${row.original.id}`, '_blank', 'noopener,noreferrer');
    },
    renderButton: ({ rowLabel, onClick }) => (
      <DataViewDetailsButton rowLabel={rowLabel} onClick={onClick} target="new-tab" />
    ),
  };

  return (
    <Flexbox direction="column" gap="lg">
      <Flexbox direction="column" gap="sm">
        <Text styleAs="h3">Text button</Text>
        <TableView rowClickOptions={textButton} />
      </Flexbox>
      <Flexbox direction="column" gap="sm">
        <Text styleAs="h3">Opens a new tab</Text>
        <CardView rowClickOptions={newTab}>
          {(row) => <TeamACard row={row} />}
        </CardView>
      </Flexbox>
      <Drawer open={open} onClose={() => setOpen(false)} side="right" title={order ? `${order.id} — ${order.customer}` : undefined}>
        <Text>Row details here</Text>
      </Drawer>
    </Flexbox>
  );
}
