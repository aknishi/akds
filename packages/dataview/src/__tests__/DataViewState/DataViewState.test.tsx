import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@aknishi/akds-reactkit';
import { useDataView } from '../../useDataView/useDataView';
import { DataViewMessage } from '../../DataViewMessage/DataViewMessage';
import type { DataViewStateProps } from '../../DataViewState/DataViewState.types';
import { TestCard } from '../fixtures/CardHarness';
import { testColumns, testOrders } from '../fixtures/orders';
import type { TestOrder } from '../fixtures/orders';

expect.extend(toHaveNoViolations);

interface HarnessProps extends DataViewStateProps {
  view: 'table' | 'cards';
  data?: TestOrder[];
}

// A stable empty array: a new one every render would make TanStack reset its
// state on every render, in a loop.
const NO_ORDERS: TestOrder[] = [];

function Harness({ view, data = NO_ORDERS, ...props }: HarnessProps) {
  const { TableView, CardView } = useDataView({ data, columns: testColumns, getRowId: (row) => row.id });
  return view === 'table'
    ? <TableView {...props} />
    : <CardView {...props}>{(row) => <TestCard row={row} />}</CardView>;
}

// The same behaviour in both views.
describe.each(['table', 'cards'] as const)('%s states', (view) => {
  it('shows the error message in an alert', () => {
    render(<Harness view={view} error="Couldn't load orders." />);
    expect(screen.getByRole('alert')).toHaveTextContent("Couldn't load orders.");
    expect(screen.queryByText('No results.')).not.toBeInTheDocument();
  });

  it('shows a default message when error is true', () => {
    render(<Harness view={view} error />);
    expect(screen.getByRole('alert')).toHaveTextContent('Couldn’t load the data.');
  });

  it('shows "Try again" only with onRetry, and calls it', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const { rerender } = render(<Harness view={view} error />);
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
    rerender(<Harness view={view} error onRetry={onRetry} />);
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('shows loading instead of the error while retrying', () => {
    render(<Harness view={view} loading error="Couldn't load orders." />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows the rows instead of an error once there are rows', () => {
    render(<Harness view={view} data={testOrders} error="Couldn't load more orders." />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Hanako Sato')).toBeInTheDocument();
  });

  it('renders custom loading, error, and empty layouts', () => {
    const { rerender } = render(<Harness view={view} loading loadingState={<p>Fetching orders</p>} />);
    expect(screen.getByText('Fetching orders')).toBeInTheDocument();
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();

    rerender(<Harness view={view} error errorState={<DataViewMessage title="Orders are unavailable" />} />);
    // Custom error layouts are still announced.
    expect(screen.getByRole('alert')).toHaveTextContent('Orders are unavailable');

    rerender(<Harness view={view} emptyState={<DataViewMessage title="No orders yet" action={<Button>Create order</Button>} />} />);
    expect(screen.getByText('No orders yet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create order' })).toBeInTheDocument();
    expect(screen.queryByText('No results.')).not.toBeInTheDocument();
  });

  it('shows nothing for a state set to null', () => {
    render(<Harness view={view} emptyState={null} />);
    expect(screen.queryByText('No results.')).not.toBeInTheDocument();
  });

  it('keeps focus in the state when "Try again" swaps the error for loading', async () => {
    const user = userEvent.setup();
    function Retrying() {
      const [loading, setLoading] = React.useState(false);
      return <Harness view={view} loading={loading} error onRetry={() => setLoading(true)} />;
    }
    const { container } = render(<Retrying />);
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    const state = container.querySelector('[class*="__state"]');
    expect(state).toHaveFocus();
  });

  it('moves focus to the new content once rows arrive after a retry', async () => {
    const user = userEvent.setup();
    function Retrying() {
      const [data, setData] = React.useState<TestOrder[]>(NO_ORDERS);
      return <Harness view={view} data={data} error={data.length === 0} onRetry={() => setData(testOrders)} />;
    }
    render(<Retrying />);
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    if (view === 'table') expect(screen.getByRole('table')).toHaveFocus();
    else expect(screen.getByRole('article', { name: 'Hanako Sato' })).toHaveFocus();
  });

  it('does not move focus that is elsewhere on the page', () => {
    function Page({ loading }: { loading: boolean }) {
      return (
        <>
          <button type="button">Elsewhere</button>
          <Harness view={view} loading={loading} />
        </>
      );
    }
    const { rerender } = render(<Page loading />);
    screen.getByRole('button', { name: 'Elsewhere' }).focus();
    rerender(<Page loading={false} />);
    expect(screen.getByRole('button', { name: 'Elsewhere' })).toHaveFocus();
  });

  describe('axe accessibility', () => {
    it('has no violations in the error state', async () => {
      const { container } = render(<Harness view={view} error onRetry={() => {}} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations in the empty state', async () => {
      const { container } = render(<Harness view={view} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

describe('DataViewMessage', () => {
  it('renders the title, description, and action, with the icon hidden', () => {
    render(
      <DataViewMessage
        icon={<span data-testid="icon" />}
        title="No orders yet"
        description="Orders appear here once customers buy something."
        action={<Button>Create order</Button>}
      />,
    );
    expect(screen.getByText('No orders yet')).toHaveClass('akds-dataview-message__title');
    expect(screen.getByText('Orders appear here once customers buy something.')).toHaveClass('akds-dataview-message__description');
    expect(screen.getByRole('button', { name: 'Create order' })).toBeInTheDocument();
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('passes className, attributes, and ref to the root', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<DataViewMessage ref={ref} title="Title" className="custom" data-testid="message" />);
    expect(screen.getByTestId('message')).toHaveClass('akds-dataview-message', 'custom');
    expect(ref.current).toBe(screen.getByTestId('message'));
  });
});
