import React, { useState } from 'react';
import { Flexbox, ToggleButton, ToggleGroup } from '@aknishi/akds-reactkit';
import { useDataView } from '../index';
import { columns } from './columns';
import type { Order } from './data';

type State = 'loading' | 'error' | 'empty';

// No rows, so the view shows a state instead. Loading wins over error, and
// error over empty, so pass all three and let DataView pick.
const NO_ORDERS: Order[] = [];

export function StatesDefault() {
  const [state, setState] = useState<State>('loading');
  const { TableView } = useDataView({ data: NO_ORDERS, columns, getRowId: (row) => row.id });

  return (
    <Flexbox direction="column" gap="sm">
      <Flexbox>
        <ToggleGroup aria-label="State" value={state} onChange={(value) => setState(value as State)}>
          <ToggleButton value="loading">Loading</ToggleButton>
          <ToggleButton value="error">Error</ToggleButton>
          <ToggleButton value="empty">Empty</ToggleButton>
        </ToggleGroup>
      </Flexbox>
      <TableView
        selectable
        loading={state === 'loading'}
        error={state === 'error' ? 'Couldn’t load orders.' : undefined}
        onRetry={() => setState('loading')}
      />
    </Flexbox>
  );
}
