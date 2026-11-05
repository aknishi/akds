import React, { useMemo, useState } from 'react';
import { Accordion, AccordionItem, ActionsMenu, Avatar, Flexbox, MenuItem, Tag, Text, ToggleButton, ToggleGroup, useBreakpointUp, useMediaQuery } from '@aknishi/akds-reactkit';
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

// The cards show only these columns, so the sort menu offers only these too.
const cardColumnIds = ['id', 'customer', 'status', 'total', 'date'];
const cardColumns = columns.filter((column) => 'accessorKey' in column && cardColumnIds.includes(column.accessorKey as string));

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

// Team A: an avatar and subtitle in the header, then every field as a label
// and value, formatted their own way straight from row.original
function TeamACard({ row }: { row: Row<Order> }) {
  const order = row.original;
  return (
    <DataViewCard title={order.customer} subtitle={order.id} avatar={<Avatar name={order.customer} />}>
      <Flexbox as="dl" direction="column" gap={1}>
        <Detail label="Order">{order.id}</Detail>
        <Detail label="Status"><Tag variant={statusVariant[order.status]} size="sm">{order.status}</Tag></Detail>
        <Detail label="Total">{currency.format(order.total)}</Detail>
        <Detail label="Date">{shortDate.format(new Date(order.date))}</Detail>
      </Flexbox>
    </DataViewCard>
  );
}

// Team B's own term and value: the label above the value.
function StackedDetail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Flexbox direction="column" gap={0.5}>
      <Text as="dt" styleAs="label">{label}</Text>
      <Text as="dd">{children}</Text>
    </Flexbox>
  );
}

// Team B: an avatar and subtitle, a short summary up front, and the rest in
// an expandable "Show more" area
function TeamBCard({ row }: { row: Row<Order> }) {
  const order = row.original;
  return (
    <DataViewCard
      title={order.customer}
      subtitle={shortDate.format(new Date(order.date))}
      avatar={<Avatar name={order.customer} />}
    >
      <Flexbox>
        <Tag variant={statusVariant[order.status]} size="sm">{order.status}</Tag>
      </Flexbox>
      <Text styleAs="h4" as="p">{currency.format(order.total)}</Text>
      <Accordion>
        <AccordionItem value="details" title="Show more">
          <Flexbox as="dl" direction="column" gap={1.5}>
            <StackedDetail label="Order">{order.id}</StackedDetail>
            <StackedDetail label="Date">{shortDate.format(new Date(order.date))}</StackedDetail>
          </Flexbox>
        </AccordionItem>
      </Accordion>
    </DataViewCard>
  );
}

type CardLayout = 'teamA' | 'teamB';

// Two teams' layouts built from the same DataViewCard: the frame (checkbox,
// avatar, title, subtitle, actions) stays identical while each team renders the body from
// row.original in its own format.
export function CardViewOptions() {
  const bulkActionsVariant = useBulkActionsVariant();
  const orders = useMemo(() => generateOrders(40), []);
  const [cardLayout, setCardLayout] = useState<CardLayout>('teamA');

  const { CardView, BulkActions, Pagination } = useDataView({
    data: orders,
    columns: cardColumns,
    getRowId: (row) => row.id,
    pageSize: 10,
  });

  return (
    <Flexbox direction="column" gap="sm">
      {/* A row Flexbox sizes the toggle to its content; the column would stretch it. */}
      <Flexbox>
        <ToggleGroup
          aria-label="Card layout"
          value={cardLayout}
          onChange={(value) => setCardLayout(value as CardLayout)}
        >
          <ToggleButton value="teamA">Team A layout</ToggleButton>
          <ToggleButton value="teamB">Team B layout</ToggleButton>
        </ToggleGroup>
      </Flexbox>

      <BulkActions variant={bulkActionsVariant} actions={bulkActions} />
      <CardView selectable cardActions={(row) => <OrderActions order={row.original} />}>
        {(row) => (cardLayout === 'teamA' ? <TeamACard row={row} /> : <TeamBCard row={row} />)}
      </CardView>
      <Pagination aria-label="Orders pages" />
    </Flexbox>
  );
}
