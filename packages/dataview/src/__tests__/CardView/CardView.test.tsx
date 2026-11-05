import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { useDataView } from '../../useDataView/useDataView';
import { CardHarness, TestCard } from '../fixtures/CardHarness';
import { testColumns, testOrders } from '../fixtures/orders';
import type { Table } from '@tanstack/react-table';
import type { TestOrder } from '../fixtures/orders';

expect.extend(toHaveNoViolations);

const cards = () => screen.getAllByRole('group');
const card = (name: string) => screen.getByRole('group', { name });

describe('CardView', () => {
  it('renders a list with one list item per row', () => {
    render(<CardHarness />);
    const list = screen.getByRole('list');
    expect(list).toHaveClass('akds-dataview-cards__list');
    expect(list.parentElement).toHaveClass('akds-dataview-cards');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('names the list with aria-label', () => {
    render(<CardHarness aria-label="Orders" />);
    expect(screen.getByRole('list', { name: 'Orders' })).toBeInTheDocument();
  });

  it('passes className and other HTML attributes to the container', () => {
    render(<CardHarness className="custom" data-testid="cards" />);
    const container = screen.getByTestId('cards');
    expect(container).toHaveClass('akds-dataview-cards', 'custom');
    expect(container).not.toHaveAttribute('aria-label');
  });

  it('puts only the first card in the tab order', () => {
    render(<CardHarness />);
    expect(cards().map((c) => c.tabIndex)).toEqual([0, -1, -1]);
  });

  it('moves focus between cards with the arrow keys, Home, and End', async () => {
    const user = userEvent.setup();
    render(<CardHarness />);
    act(() => card('Hanako Sato').focus());

    await user.keyboard('{ArrowDown}');
    expect(card('Kenji Ito')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(card('Maria Garcia')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(card('Maria Garcia')).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(card('Kenji Ito')).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(card('Hanako Sato')).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(card('Hanako Sato')).toHaveFocus();
    await user.keyboard('{End}');
    expect(card('Maria Garcia')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(card('Hanako Sato')).toHaveFocus();
  });

  it('moves the tab stop to the last focused card', async () => {
    const user = userEvent.setup();
    render(<CardHarness />);
    act(() => card('Hanako Sato').focus());
    await user.keyboard('{ArrowDown}');
    expect(cards().map((c) => c.tabIndex)).toEqual([-1, 0, -1]);
  });

  it('moves the tab stop when focus enters a card control', async () => {
    const user = userEvent.setup();
    render(<CardHarness selectable />);
    screen.getByRole('checkbox', { name: 'Select Maria Garcia' }).focus();
    await user.keyboard(' ');
    expect(cards().map((c) => c.tabIndex)).toEqual([-1, -1, 0]);
  });

  it('tabs from a card into its controls', async () => {
    const user = userEvent.setup();
    render(<CardHarness selectable />);
    act(() => card('Hanako Sato').focus());
    await user.tab();
    expect(screen.getByRole('checkbox', { name: 'Select Hanako Sato' })).toHaveFocus();
  });

  it('does not move between cards when an arrow key is pressed inside a card control', async () => {
    const user = userEvent.setup();
    render(<CardHarness selectable />);
    const checkbox = screen.getByRole('checkbox', { name: 'Select Hanako Sato' });
    checkbox.focus();
    await user.keyboard('{ArrowDown}');
    expect(checkbox).toHaveFocus();
  });

  it('ignores other keys on a card', async () => {
    const user = userEvent.setup();
    render(<CardHarness />);
    act(() => card('Hanako Sato').focus());
    await user.keyboard('a');
    expect(card('Hanako Sato')).toHaveFocus();
  });

  it('gives the tab stop to the first card when the active card is filtered out', async () => {
    const user = userEvent.setup();
    let table: Table<TestOrder> | undefined;
    function Filterable() {
      const view = useDataView({ data: testOrders, columns: testColumns, getRowId: (row) => row.id });
      table = view.tableSource;
      return <view.CardView>{(row) => <TestCard row={row} />}</view.CardView>;
    }
    render(<Filterable />);
    act(() => card('Hanako Sato').focus());
    await user.keyboard('{ArrowDown}');
    expect(card('Kenji Ito').tabIndex).toBe(0);

    act(() => table!.getColumn('customer')!.setFilterValue('a'));
    expect(screen.queryByRole('group', { name: 'Kenji Ito' })).not.toBeInTheDocument();
    expect(cards().map((c) => c.tabIndex)).toEqual([0, -1]);
  });
});

describe('CardView empty state', () => {
  it('shows "No results." instead of an empty list', () => {
    let table: Table<TestOrder> | undefined;
    function Filterable() {
      const view = useDataView({ data: testOrders, columns: testColumns, getRowId: (row) => row.id });
      table = view.tableSource;
      return <view.CardView>{(row) => <TestCard row={row} />}</view.CardView>;
    }
    render(<Filterable />);
    act(() => table!.setGlobalFilter('zzz'));
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.getByText('No results.').closest('.akds-dataview-cards__state')).toHaveClass('akds-dataview-cards__empty');
  });

  it('keeps the container, its attributes, and the header when there are no results', () => {
    let table: Table<TestOrder> | undefined;
    function Filterable() {
      const view = useDataView({ data: testOrders, columns: testColumns, getRowId: (row) => row.id });
      table = view.tableSource;
      return <view.CardView className="custom" data-testid="cards">{(row) => <TestCard row={row} />}</view.CardView>;
    }
    render(<Filterable />);
    act(() => table!.setGlobalFilter('zzz'));
    expect(screen.getByTestId('cards')).toHaveClass('akds-dataview-cards', 'custom');
    expect(screen.getByRole('button', { name: 'Sort by' })).toBeInTheDocument();
  });
});

const names = () => cards().map((c) => within(c).getByRole('heading').textContent);

describe('CardView header', () => {
  it('renders no header when nothing is selectable or sortable', () => {
    const unsortable = testColumns.map((column) => ({ ...column, enableSorting: false }));
    function Plain() {
      const { CardView } = useDataView({ data: testOrders, columns: unsortable, getRowId: (row) => row.id });
      return <CardView>{(row) => <TestCard row={row} />}</CardView>;
    }
    const { container } = render(<Plain />);
    expect(container.querySelector('.akds-dataview-cards__header')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sort by' })).not.toBeInTheDocument();
  });

  it('shows the sort controls when a column is sortable', () => {
    render(<CardHarness />);
    expect(screen.getByRole('button', { name: 'Sort by' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reverse sort order' })).toBeDisabled();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('puts the header before the first card in the tab order', async () => {
    const user = userEvent.setup();
    render(<CardHarness />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Sort by' })).toHaveFocus();
    // Reverse is disabled until a column is sorted, so it's skipped.
    await user.tab();
    expect(card('Hanako Sato')).toHaveFocus();
  });

  it('lists the default order and only the sortable columns, by plain-text name', async () => {
    const user = userEvent.setup();
    render(<CardHarness />);
    await user.click(screen.getByRole('button', { name: 'Sort by' }));
    expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual([
      'Default order',
      'Customer',
      'Order total',
    ]);
    expect(screen.getByRole('menuitem', { name: 'Default order' })).toHaveAttribute('aria-current', 'true');
  });

  it('sorts the cards ascending by the chosen column', async () => {
    const user = userEvent.setup();
    render(<CardHarness />);
    await user.click(screen.getByRole('button', { name: 'Sort by' }));
    await user.click(screen.getByRole('menuitem', { name: 'Order total' }));
    expect(names()).toEqual(['Kenji Ito', 'Maria Garcia', 'Hanako Sato']);
    expect(screen.getByRole('button', { name: 'Sort by: Order total, ascending' })).toBeInTheDocument();
  });

  it('marks the current column in the menu', async () => {
    const user = userEvent.setup();
    render(<CardHarness />);
    await user.click(screen.getByRole('button', { name: 'Sort by' }));
    await user.click(screen.getByRole('menuitem', { name: 'Customer' }));
    await user.click(screen.getByRole('button', { name: /^Sort by: Customer/ }));
    expect(screen.getByRole('menuitem', { name: 'Customer' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('menuitem', { name: 'Default order' })).not.toHaveAttribute('aria-current');
  });

  it('reverses the sort direction', async () => {
    const user = userEvent.setup();
    render(<CardHarness />);
    await user.click(screen.getByRole('button', { name: 'Sort by' }));
    await user.click(screen.getByRole('menuitem', { name: 'Order total' }));
    await user.click(screen.getByRole('button', { name: 'Reverse sort order' }));
    expect(names()).toEqual(['Hanako Sato', 'Maria Garcia', 'Kenji Ito']);
    expect(screen.getByRole('button', { name: 'Sort by: Order total, descending' })).toBeInTheDocument();
  });

  it('returns to the original order with Default order', async () => {
    const user = userEvent.setup();
    render(<CardHarness />);
    await user.click(screen.getByRole('button', { name: 'Sort by' }));
    await user.click(screen.getByRole('menuitem', { name: 'Order total' }));
    await user.click(screen.getByRole('button', { name: /^Sort by: Order total/ }));
    await user.click(screen.getByRole('menuitem', { name: 'Default order' }));
    expect(names()).toEqual(['Hanako Sato', 'Kenji Ito', 'Maria Garcia']);
    expect(screen.getByRole('button', { name: 'Reverse sort order' })).toBeDisabled();
  });

  it('announces the new sort', async () => {
    const user = userEvent.setup();
    render(<CardHarness />);
    expect(screen.getByRole('status')).toHaveTextContent('');
    await user.click(screen.getByRole('button', { name: 'Sort by' }));
    await user.click(screen.getByRole('menuitem', { name: 'Customer' }));
    expect(screen.getByRole('status')).toHaveTextContent('Sorted by Customer, ascending.');
  });

  it('shares sorting with the table', async () => {
    const user = userEvent.setup();
    function Both() {
      const { TableView, CardView } = useDataView({ data: testOrders, columns: testColumns, getRowId: (row) => row.id });
      return (
        <>
          <TableView />
          <CardView>{(row) => <TestCard row={row} />}</CardView>
        </>
      );
    }
    render(<Both />);
    await user.click(screen.getByRole('button', { name: 'Customer' }));
    expect(screen.getByRole('button', { name: 'Sort by: Customer, ascending' })).toBeInTheDocument();
  });

  it('adds a select all checkbox when selectable', async () => {
    const user = userEvent.setup();
    render(<CardHarness selectable />);
    const selectAll = screen.getByRole('checkbox', { name: 'Select all shown rows' });
    selectAll.focus();
    await user.keyboard(' ');
    expect(selectAll).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Select Kenji Ito' })).toBeChecked();
  });

  it('shows the select all checkbox as mixed when some rows are selected', async () => {
    const user = userEvent.setup();
    render(<CardHarness selectable />);
    screen.getByRole('checkbox', { name: 'Select Kenji Ito' }).focus();
    await user.keyboard(' ');
    expect(screen.getByRole('checkbox', { name: 'Select all shown rows' })).toBePartiallyChecked();
  });

  describe('axe accessibility', () => {
    it('has no violations with sorting', async () => {
      const { container } = render(<CardHarness aria-label="Orders" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when selectable and sorted', async () => {
      const user = userEvent.setup();
      const { container } = render(<CardHarness aria-label="Orders" selectable />);
      await user.click(screen.getByRole('button', { name: 'Sort by' }));
      await user.click(screen.getByRole('menuitem', { name: 'Customer' }));
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

describe('CardView loading', () => {
  function Empty(props: { loading?: boolean; loadingMore?: boolean }) {
    const { CardView } = useDataView<TestOrder>({ data: [], columns: testColumns, getRowId: (row) => row.id });
    return <CardView data-testid="cards" {...props}>{(row) => <TestCard row={row} />}</CardView>;
  }

  it('shows the loading state instead of "No results." while there are no rows', () => {
    render(<Empty loading />);
    expect(screen.getByText('Loading…').closest('.akds-dataview-cards__state')).toHaveClass('akds-dataview-cards__loading');
    expect(screen.queryByText('No results.')).not.toBeInTheDocument();
    expect(screen.getByTestId('cards')).toHaveAttribute('aria-busy', 'true');
  });

  it('shows "No results." once loading ends with no rows', () => {
    const { rerender } = render(<Empty loading />);
    rerender(<Empty />);
    expect(screen.getByText('No results.')).toBeInTheDocument();
    expect(screen.getByTestId('cards')).not.toHaveAttribute('aria-busy');
  });

  it('keeps the cards shown, marked as refreshing, while loading cards that replace them', () => {
    render(<CardHarness loading data-testid="cards" />);
    expect(cards()).toHaveLength(3);
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading more…')).not.toBeInTheDocument();
    expect(screen.getByTestId('cards')).toHaveClass('akds-dataview-cards--refreshing');
    expect(screen.getByTestId('cards')).toHaveAttribute('aria-busy', 'true');
  });

  it('is not marked as refreshing while showing the loading state', () => {
    render(<Empty loading />);
    expect(screen.getByTestId('cards')).not.toHaveClass('akds-dataview-cards--refreshing');
  });

  it('shows "Loading more…" after the cards, without refreshing', () => {
    render(<CardHarness loadingMore data-testid="cards" />);
    expect(cards()).toHaveLength(3);
    const indicator = screen.getByText('Loading more…').closest('.akds-dataview-cards__loading-more');
    expect(indicator).toBeInTheDocument();
    // After the list, not inside it, so it isn't counted as a card.
    expect(screen.getByRole('list').contains(indicator)).toBe(false);
    expect(screen.getByTestId('cards')).not.toHaveClass('akds-dataview-cards--refreshing');
    expect(screen.getByTestId('cards')).toHaveAttribute('aria-busy', 'true');
  });

  it('shows the loading state for loadingMore while there are no cards', () => {
    render(<Empty loadingMore />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(screen.queryByText('Loading more…')).not.toBeInTheDocument();
  });

  it('gives way to loading when both are set', () => {
    render(<CardHarness loading loadingMore data-testid="cards" />);
    expect(screen.queryByText('Loading more…')).not.toBeInTheDocument();
    expect(screen.getByTestId('cards')).toHaveClass('akds-dataview-cards--refreshing');
  });

  it('has no axe violations while loading', async () => {
    const { container } = render(<Empty loading />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations while refreshing and while loading more', async () => {
    const { container, rerender } = render(<CardHarness loading />);
    expect(await axe(container)).toHaveNoViolations();
    rerender(<CardHarness loadingMore />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('CardView held height', () => {
  // jsdom has no layout: cards measure 240px and "No results." 80px.
  let rectSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    rectSpy = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      const height = this.classList.contains('akds-dataview-cards__empty') ? 80 : 240;
      return { height, width: 0, top: 0, left: 0, right: 0, bottom: height, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
    });
  });
  afterEach(() => rectSpy.mockRestore());

  function Switching({ rows, ...props }: { rows: TestOrder[]; loading?: boolean; error?: string }) {
    const { CardView } = useDataView<TestOrder>({ data: rows, columns: testColumns, getRowId: (row) => row.id });
    return <CardView {...props}>{(row) => <TestCard row={row} />}</CardView>;
  }
  const state = () => document.querySelector<HTMLElement>('.akds-dataview-cards__state')!;

  it('keeps the cards\' height when they give way to the error or loading state', () => {
    const { rerender } = render(<Switching rows={testOrders} />);
    rerender(<Switching rows={[]} error="Couldn’t load orders." />);
    expect(state()).toHaveStyle({ minHeight: '240px' });
    rerender(<Switching rows={[]} loading error="Couldn’t load orders." />);
    expect(state()).toHaveStyle({ minHeight: '240px' });
  });

  it('holds the height shown just before, so loading after "No results." stays short', () => {
    const { rerender } = render(<Switching rows={testOrders} />);
    rerender(<Switching rows={[]} />);
    expect(state().style.minHeight).toBe('');
    rerender(<Switching rows={[]} loading />);
    expect(state()).toHaveStyle({ minHeight: '80px' });
  });

  it('does not hold a height on the first load', () => {
    render(<Switching rows={[]} loading />);
    expect(state().style.minHeight).toBe('');
  });
});
