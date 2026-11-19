import React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Tag } from '@aknishi/akds-reactkit';

export interface TestOrder {
  id: string;
  customer: string;
  status: 'Processing' | 'Shipped';
  total: number;
}

export const testOrders: TestOrder[] = [
  { id: 'ORD-1', customer: 'Hanako Sato', status: 'Processing', total: 30 },
  { id: 'ORD-2', customer: 'Kenji Ito', status: 'Shipped', total: 10 },
  { id: 'ORD-3', customer: 'Maria Garcia', status: 'Processing', total: 20 },
];

export const testColumns: ColumnDef<TestOrder, any>[] = [
  { accessorKey: 'id', header: 'Order' },
  { accessorKey: 'customer', header: 'Customer', enableSorting: true, meta: { rowHeader: true } },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <Tag size="sm">{getValue<string>()}</Tag>,
  },
  {
    accessorKey: 'total',
    header: () => <span>Total</span>,
    enableSorting: true,
    meta: { ariaLabel: 'Order total' },
    cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
  },
];
