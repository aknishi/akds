import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { ActionsMenu, MenuItem } from '@aknishi/akds-reactkit';
import { useDataView } from '../../useDataView/useDataView';
import type { TableViewProps } from '../../TableView/TableView.types';
import { CardHarness } from '../fixtures/CardHarness';
import { testColumns, testOrders } from '../fixtures/orders';
import type { TestOrder } from '../fixtures/orders';

expect.extend(toHaveNoViolations);

interface HarnessProps extends TableViewProps<TestOrder> {
  columns?: ColumnDef<TestOrder, any>[];
  getRowLabel?: (row: Row<TestOrder>) => string;
}

function Harness({ columns = testColumns, getRowLabel, ...props }: HarnessProps) {
  const { TableView } = useDataView({
    data: testOrders,
    columns,
    getRowId: (row) => row.id,
    ...(getRowLabel ? { getRowLabel } : {}),
  });
  return <TableView {...props} />;
}

const actions = (row: Row<TestOrder>) => (
  <ActionsMenu label={`Actions for ${row.original.customer}`}>
    <MenuItem>Cancel order</MenuItem>
  </ActionsMenu>
);

const bodyRows = () => screen.getAllByRole('row').slice(1);
const details = (label: string) => screen.getByRole('button', { name: `View details for ${label}` });

afterEach(() => {
  vi.restoreAllMocks();
});

describe('TableView row click', () => {
  it('renders no Details buttons and ignores row clicks without rowClickOptions', async () => {
    const user = userEvent.setup();
    render(<Harness selectable />);
    expect(screen.queryByRole('button', { name: /View details/ })).not.toBeInTheDocument();
    const row = bodyRows()[0]!;
    expect(row).not.toHaveClass('akds-dataview-table__row--clickable');
    await user.click(within(row).getByText('ORD-1'));
    expect(within(row).getByRole('checkbox')).not.toBeChecked();
  });

  it('names each Details button with the rowHeader column by default', () => {
    render(<Harness rowClickOptions={{ onClick: () => {} }} />);
    expect(screen.getAllByRole('button', { name: /^View details for / })).toHaveLength(3);
    expect(details('Hanako Sato')).toBeInTheDocument();
  });

  it('falls back to the first data column when no column is a rowHeader', () => {
    const columns = testColumns.map(({ meta: _meta, ...column }) => column) as ColumnDef<TestOrder, any>[];
    render(<Harness columns={columns} rowClickOptions={{ onClick: () => {} }} selectable />);
    expect(details('ORD-1')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Select ORD-1' })).toBeInTheDocument();
  });

  it('names the Details button and checkbox with getRowLabel when passed', () => {
    render(<Harness getRowLabel={(row) => `order ${row.original.id}`} rowClickOptions={{ onClick: () => {} }} selectable />);
    expect(details('order ORD-2')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Select order ORD-2' })).toBeInTheDocument();
  });

  it('places the Details button in the first data cell, after its content', () => {
    render(<Harness rowClickOptions={{ onClick: () => {} }} selectable />);
    const firstDataCell = within(bodyRows()[0]!).getAllByRole('cell')[1]!;
    const button = within(firstDataCell).getByRole('button');
    const wrapper = firstDataCell.querySelector('.akds-dataview-table__details-cell')!;
    expect(wrapper.firstChild).toHaveTextContent('ORD-1');
    expect(wrapper.lastElementChild).toContainElement(button);
  });

  it('does not make the row a keyboard target', () => {
    render(<Harness rowClickOptions={{ onClick: () => {} }} />);
    const row = bodyRows()[0]!;
    expect(row).not.toHaveAttribute('tabindex');
    expect(row).not.toHaveAttribute('role', 'button');
    expect(row).toHaveClass('akds-dataview-table__row--clickable');
  });

  it('calls onClick once with the row when a non-interactive part is clicked', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<Harness rowClickOptions={{ onClick: onRowClick }} selectable />);
    await user.click(within(bodyRows()[1]!).getByText('$10.00'));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick.mock.calls[0]![0].original.customer).toBe('Kenji Ito');
  });

  it('does not toggle selection when the row is clicked', async () => {
    const user = userEvent.setup();
    render(<Harness rowClickOptions={{ onClick: () => {} }} selectable />);
    const row = bodyRows()[0]!;
    await user.click(within(row).getByText('$30.00'));
    expect(within(row).getByRole('checkbox')).not.toBeChecked();
  });

  it('ignores clicks on the checkbox and the space around it, and the checkbox still selects', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<Harness rowClickOptions={{ onClick: onRowClick }} selectable />);
    const row = bodyRows()[0]!;
    const checkbox = within(row).getByRole('checkbox');
    await user.click(checkbox.closest('label')!);
    expect(checkbox).toBeChecked();
    await user.click(checkbox.closest('td')!);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('ignores clicks on the actions menu, its items, and the space around it', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<Harness rowClickOptions={{ onClick: onRowClick }} rowActions={actions} />);
    const trigger = screen.getByRole('button', { name: 'Actions for Hanako Sato' });
    await user.click(trigger);
    // The menu renders in a portal, but React events still bubble to the row.
    await user.click(screen.getByRole('menuitem', { name: 'Cancel order' }));
    await user.click(trigger.closest('td')!);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('ignores clicks on elements with data-dataview-ignore-click', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    const columns: ColumnDef<TestOrder, any>[] = [
      ...testColumns,
      { id: 'custom', header: 'Custom', cell: () => <span data-dataview-ignore-click="">Custom area</span> },
    ];
    render(<Harness columns={columns} rowClickOptions={{ onClick: onRowClick }} />);
    await user.click(within(bodyRows()[0]!).getByText('Custom area'));
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('calls onClick exactly once when the Details button is clicked', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<Harness rowClickOptions={{ onClick: onRowClick }} />);
    await user.click(details('Maria Garcia'));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick.mock.calls[0]![0].original.customer).toBe('Maria Garcia');
  });

  it('reaches the Details button with Tab and calls onClick on Enter', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(<Harness rowClickOptions={{ onClick: onRowClick }} />);
    const button = details('Hanako Sato');
    for (let i = 0; i < 10 && document.activeElement !== button; i++) await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick.mock.calls[0]![0].original.customer).toBe('Hanako Sato');
  });

  it('ignores the click that ends a text selection', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => 'Hanako' } as Selection);
    render(<Harness rowClickOptions={{ onClick: onRowClick }} />);
    await user.click(within(bodyRows()[0]!).getByText('$30.00'));
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('keeps every Details button in the accessibility tree', () => {
    render(<Harness rowClickOptions={{ onClick: () => {} }} />);
    const button = details('Kenji Ito');
    expect(button).not.toHaveAttribute('hidden');
    // Faded by its slot with opacity only, never hidden.
    expect(button.closest('.akds-dataview-details')).toHaveClass('akds-dataview-details--reveal');
  });

  it('has no axe violations with rowClickOptions', async () => {
    const { container } = render(<Harness rowClickOptions={{ onClick: () => {} }} selectable rowActions={actions} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('CardView card click', () => {
  const card = (name: string) => screen.getByRole('group', { name });

  it('renders no Details buttons without rowClickOptions', () => {
    render(<CardHarness selectable />);
    expect(screen.queryByRole('button', { name: /View details/ })).not.toBeInTheDocument();
    expect(card('Hanako Sato').closest('li')).not.toHaveClass('akds-dataview-cards__item--clickable');
  });

  it('renders a Details button named with the row label in each card', () => {
    render(<CardHarness rowClickOptions={{ onClick: () => {} }} />);
    expect(screen.getAllByRole('button', { name: /^View details for / })).toHaveLength(3);
    expect(within(card('Kenji Ito')).getByRole('button', { name: 'View details for Kenji Ito' })).toBeInTheDocument();
  });

  it('places the Details button after the title and before the header actions', () => {
    render(<CardHarness selectable rowClickOptions={{ onClick: () => {} }} cardActions={actions} />);
    const hanako = card('Hanako Sato');
    const checkbox = within(hanako).getByRole('checkbox');
    const title = within(hanako).getByRole('heading', { level: 3 });
    const button = within(hanako).getByRole('button', { name: 'View details for Hanako Sato' });
    const menu = within(hanako).getByRole('button', { name: 'Actions for Hanako Sato' });
    expect(button.closest('.akds-card-header')).not.toBeNull();
    const following = (a: Node, b: Node) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING;
    expect(following(checkbox, title)).toBeTruthy();
    expect(following(title, button)).toBeTruthy();
    expect(following(button, menu)).toBeTruthy();
  });

  it('gives the card wrapper no tabIndex or interactive role', () => {
    render(<CardHarness rowClickOptions={{ onClick: () => {} }} />);
    const item = card('Hanako Sato').closest('li')!;
    expect(item).not.toHaveAttribute('tabindex');
    expect(item).not.toHaveAttribute('role');
    expect(item).toHaveClass('akds-dataview-cards__item--clickable');
  });

  it('calls onClick once with the row when the card body is clicked, without selecting it', async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();
    render(<CardHarness selectable rowClickOptions={{ onClick: onCardClick }} />);
    await user.click(within(card('Kenji Ito')).getByText('$10.00'));
    expect(onCardClick).toHaveBeenCalledTimes(1);
    expect(onCardClick.mock.calls[0]![0].original.customer).toBe('Kenji Ito');
    expect(within(card('Kenji Ito')).getByRole('checkbox')).not.toBeChecked();
  });

  it('ignores clicks on the checkbox and the actions, and the checkbox still selects', async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();
    render(<CardHarness selectable rowClickOptions={{ onClick: onCardClick }} cardActions={actions} />);
    const hanako = card('Hanako Sato');
    const checkbox = within(hanako).getByRole('checkbox');
    await user.click(checkbox.closest('label')!);
    expect(checkbox).toBeChecked();
    const trigger = within(hanako).getByRole('button', { name: 'Actions for Hanako Sato' });
    await user.click(trigger);
    await user.click(screen.getByRole('menuitem', { name: 'Cancel order' }));
    await user.click(trigger.closest('.akds-dataview-actions')!);
    expect(onCardClick).not.toHaveBeenCalled();
  });

  it('calls onClick exactly once from the Details button, by click or Enter', async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();
    render(<CardHarness rowClickOptions={{ onClick: onCardClick }} />);
    const button = within(card('Maria Garcia')).getByRole('button', { name: 'View details for Maria Garcia' });
    await user.click(button);
    expect(onCardClick).toHaveBeenCalledTimes(1);
    button.focus();
    await user.keyboard('{Enter}');
    expect(onCardClick).toHaveBeenCalledTimes(2);
  });

  it('reaches the Details button with Tab', async () => {
    const user = userEvent.setup();
    render(<CardHarness rowClickOptions={{ onClick: () => {} }} />);
    const button = within(card('Hanako Sato')).getByRole('button', { name: 'View details for Hanako Sato' });
    for (let i = 0; i < 5 && document.activeElement !== button; i++) await user.tab();
    expect(button).toHaveFocus();
  });

  it('ignores the click that ends a text selection', async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();
    vi.spyOn(window, 'getSelection').mockReturnValue({ toString: () => 'Kenji' } as Selection);
    render(<CardHarness rowClickOptions={{ onClick: onCardClick }} />);
    await user.click(within(card('Kenji Ito')).getByText('$10.00'));
    expect(onCardClick).not.toHaveBeenCalled();
  });

  it('has no axe violations with rowClickOptions', async () => {
    const { container } = render(<CardHarness selectable rowClickOptions={{ onClick: () => {} }} cardActions={actions} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
