import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@aknishi/akds-reactkit';
import { useDataView } from '../../useDataView/useDataView';
import { DataViewDetailsButton } from '../../DataViewDetailsButton/DataViewDetailsButton';
import type { RowClickOptions } from '../../headless/rowClickOptions';
import { TestCard } from '../fixtures/CardHarness';
import { testColumns, testOrders } from '../fixtures/orders';
import type { TestOrder } from '../fixtures/orders';

expect.extend(toHaveNoViolations);

function Harness({ view, options }: { view: 'table' | 'cards'; options: RowClickOptions<TestOrder> }) {
  const { TableView, CardView } = useDataView({ data: testOrders, columns: testColumns, getRowId: (row) => row.id });
  return view === 'table'
    ? <TableView rowClickOptions={options} />
    : <CardView rowClickOptions={options}>{(row) => <TestCard row={row} />}</CardView>;
}

const textButton = (onClick: RowClickOptions<TestOrder>['onClick']): RowClickOptions<TestOrder> => ({
  onClick,
  renderButton: ({ rowLabel, onClick: open }) => (
    <Button size="sm" appearance="bordered" onClick={open} aria-label={`Details for ${rowLabel}`}>
      Details
    </Button>
  ),
});

describe.each(['table', 'cards'] as const)('%s rowClickOptions', (view) => {
  it('renders a custom control from renderButton instead of the default', () => {
    render(<Harness view={view} options={textButton(() => {})} />);
    expect(screen.getByRole('button', { name: 'Details for Hanako Sato' })).toHaveTextContent('Details');
    expect(screen.queryByRole('button', { name: /^View details for/ })).not.toBeInTheDocument();
  });

  it('passes the row, its label, and an onClick that opens it', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const renderButton = vi.fn(({ rowLabel, onClick: open }) => (
      <button type="button" onClick={open}>{`Open ${rowLabel}`}</button>
    ));
    render(<Harness view={view} options={{ onClick, renderButton }} />);
    expect(renderButton).toHaveBeenCalledWith(expect.objectContaining({ rowLabel: 'Kenji Ito' }));
    expect(renderButton.mock.calls.find(([ctx]) => ctx.rowLabel === 'Kenji Ito')![0].row.original.id).toBe('ORD-2');

    await user.click(screen.getByRole('button', { name: 'Open Kenji Ito' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]![0].original.id).toBe('ORD-2');
  });

  it('never counts a click on a custom control as a second row click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    // Not a button: only the slot's ignore attribute keeps the row's own
    // handler from also running.
    render(
      <Harness
        view={view}
        options={{ onClick, renderButton: ({ onClick: open }) => <span onClick={open}>More</span> }}
      />,
    );
    await user.click(screen.getAllByText('More')[0]!);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fades the control in on hover by default', () => {
    render(<Harness view={view} options={textButton(() => {})} />);
    const slot = screen.getByRole('button', { name: 'Details for Hanako Sato' }).closest('.akds-dataview-details');
    expect(slot).toHaveClass('akds-dataview-details--reveal');
  });

  it('always shows the control when revealButtonOnHover is false', () => {
    render(<Harness view={view} options={{ ...textButton(() => {}), revealButtonOnHover: false }} />);
    const slot = screen.getByRole('button', { name: 'Details for Hanako Sato' }).closest('.akds-dataview-details');
    expect(slot).not.toHaveClass('akds-dataview-details--reveal');
  });

  it('still opens details when the row itself is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Harness view={view} options={textButton(onClick)} />);
    const scope = view === 'table'
      ? screen.getByRole('row', { name: /Maria Garcia/ })
      : screen.getByRole('article', { name: 'Maria Garcia' });
    await user.click(within(scope).getByText('$20.00'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]![0].original.id).toBe('ORD-3');
  });

  it('has no axe violations with a custom control', async () => {
    const { container } = render(<Harness view={view} options={textButton(() => {})} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('DataViewDetailsButton', () => {
  it('defaults to the drawer target', () => {
    render(<DataViewDetailsButton rowLabel="Hanako Sato" onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'View details for Hanako Sato' })).toBeInTheDocument();
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveTextContent('View details');
  });

  it('names the page target "Go to details"', () => {
    render(<DataViewDetailsButton rowLabel="Hanako Sato" onClick={() => {}} target="page" />);
    expect(screen.getByRole('button', { name: 'Go to details for Hanako Sato' })).toBeInTheDocument();
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveTextContent('Go to details');
  });

  it('says the new-tab target opens a new tab', () => {
    render(<DataViewDetailsButton rowLabel="Hanako Sato" onClick={() => {}} target="new-tab" />);
    expect(screen.getByRole('button', { name: 'Open details for Hanako Sato in a new tab' })).toBeInTheDocument();
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveTextContent('Open in a new tab');
  });

  it('uses a custom icon, label, and tooltip', () => {
    render(
      <DataViewDetailsButton
        rowLabel="Hanako Sato"
        onClick={() => {}}
        icon={<span data-testid="custom-icon" />}
        label={(rowLabel) => `Preview ${rowLabel}`}
        tooltip="Preview"
      />,
    );
    const button = screen.getByRole('button', { name: 'Preview Hanako Sato' });
    expect(within(button).getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveTextContent('Preview');
  });

  it('calls onClick and forwards its ref to the button', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const ref = React.createRef<HTMLButtonElement>();
    render(<DataViewDetailsButton ref={ref} rowLabel="Hanako Sato" onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(ref.current).toBe(screen.getByRole('button'));
  });
});
