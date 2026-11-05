import React, { useMemo } from 'react';
import { Flexbox } from '@aknishi/akds-reactkit';
import { useDataView } from '../index';
import { columns } from './columns';
import { generateOrders } from './data';

export function TableViewDefault() {
  const orders = useMemo(() => generateOrders(12), []);
  const { TableView, Pagination } = useDataView({ data: orders, columns, getRowId: (row) => row.id, pageSize: 10 });
  return (
    <Flexbox direction="column" gap="sm">
      <TableView />
      <Pagination aria-label="Orders pages" />
    </Flexbox>
  );
}
