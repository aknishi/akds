import React from 'react';
import type { Row } from '@tanstack/react-table';
import { useDataView } from '../../useDataView/useDataView';
import { DataViewCard } from '../../DataViewCard/DataViewCard';
import { DataViewField } from '../../DataViewField/DataViewField';
import type { CardViewProps } from '../../CardView/CardView.types';
import { testColumns, testOrders } from './orders';
import type { TestOrder } from './orders';

export function TestCard({ row }: { row: Row<TestOrder> }) {
  return (
    <DataViewCard title={row.getValue<string>('customer')}>
      <DataViewField column="status" />
      <DataViewField column="total" />
    </DataViewCard>
  );
}

export function CardHarness(props: Partial<CardViewProps<TestOrder>>) {
  const { CardView } = useDataView({ data: testOrders, columns: testColumns, getRowId: (row) => row.id });
  const { children = (row: Row<TestOrder>) => <TestCard row={row} />, ...rest } = props;
  return <CardView {...rest}>{children}</CardView>;
}
