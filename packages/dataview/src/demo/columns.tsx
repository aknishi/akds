import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Tag, VisuallyHidden } from '@aknishi/akds-reactkit';
import { compareStatus } from './data';
import type { Order } from './data';

// Tag colors for each status, shared with the card layouts so they match the table.
export const statusVariant = {
  Processing: 'info',
  Shipped: 'success',
  Delayed: 'warning',
  Delivered: 'default',
} as const;

export const columns: ColumnDef<Order, any>[] = [
  { accessorKey: 'id', header: 'Order' },
  // rowHeader: the customer names the row, for screen readers and checkbox labels
  { accessorKey: 'customer', header: 'Customer', enableSorting: true, meta: { rowHeader: true } },
  {
    accessorKey: 'status',
    header: 'Status',
    // Sorts by progress (Processing first, Delivered last), not alphabetically.
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => compareStatus(rowA.getValue(columnId), rowB.getValue(columnId)),
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

// Adds a long text column, for the pinned-columns example.
export const wideColumns: ColumnDef<Order, any>[] = [
  ...columns,
  { accessorKey: 'notes', header: 'Notes' },
];
