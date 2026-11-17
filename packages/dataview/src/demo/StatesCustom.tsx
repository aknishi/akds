import React, { useState } from 'react';
import { Button, Flexbox, Spinner, ToggleButton, ToggleGroup } from '@aknishi/akds-reactkit';
import { AddIcon, ErrorIcon, RefreshIcon } from '@aknishi/akds-icons';
import { DataViewCard, DataViewMessage, useDataView } from '../index';
import { columns } from './columns';
import type { Order } from './data';

type State = 'loading' | 'error' | 'empty';

const NO_ORDERS: Order[] = [];

// Each team can bring its own layout for a state. DataViewMessage keeps it on
// the system's layout; DataView still decides which state shows, sets
// aria-busy, announces errors, and keeps focus in place.
export function StatesCustom() {
  const [state, setState] = useState<State>('empty');
  const { TableView, CardView } = useDataView({ data: NO_ORDERS, columns, getRowId: (row) => row.id });

  const states = {
    loading: state === 'loading',
    error: state === 'error',
    loadingState: <DataViewMessage icon={<Spinner />} title="Fetching your orders" description="This can take a few seconds." />,
    errorState: (
      <DataViewMessage
        icon={<ErrorIcon color="error" size="lg" />}
        title="Orders are unavailable"
        description="The orders service isn’t responding. Your data is safe."
        action={(
          <Button size="sm" appearance="bordered" onClick={() => setState('loading')}>
            <RefreshIcon size="sm" aria-hidden="true" />
            Retry
          </Button>
        )}
      />
    ),
    emptyState: (
      <DataViewMessage
        title="No orders yet"
        description="Orders appear here as soon as a customer checks out."
        action={(
          <Button size="sm" onClick={() => setState('loading')}>
            <AddIcon size="sm" aria-hidden="true" />
            Create order
          </Button>
        )}
      />
    ),
  };

  return (
    <Flexbox direction="column" gap="lg">
      <Flexbox>
        <ToggleGroup aria-label="State" value={state} onChange={(value) => setState(value as State)}>
          <ToggleButton value="loading">Loading</ToggleButton>
          <ToggleButton value="error">Error</ToggleButton>
          <ToggleButton value="empty">Empty</ToggleButton>
        </ToggleGroup>
      </Flexbox>
      {/* The same states work in both views. */}
      <TableView selectable {...states} />
      <CardView selectable {...states}>
        {/* NO_ORDERS is always empty, so this card never renders; see Card View for full layouts. */}
        {(row) => <DataViewCard title={row.original.customer}>{row.original.id}</DataViewCard>}
      </CardView>
    </Flexbox>
  );
}
