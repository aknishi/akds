import React from 'react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { useDataView } from '../../useDataView/useDataView';
import type { TableViewProps } from '../../TableView/TableView.types';
import { testColumns, testOrders } from '../fixtures/orders';
import type { TestOrder } from '../fixtures/orders';

expect.extend(toHaveNoViolations);

function Harness(props: TableViewProps<TestOrder>) {
  const { TableView } = useDataView({ data: testOrders, columns: testColumns, getRowId: (row) => row.id });
  return <TableView {...props} />;
}

const bodyRows = () => screen.getAllByRole('row').slice(1);
const customers = () => bodyRows().map((row) => within(row).getByRole('rowheader').textContent);
const header = (name: string) => screen.getByRole('columnheader', { name });
// Checkbox's <input> is visually replaced and has pointer-events: none, so
// pointer users click its <label>, as here.
const checkboxLabel = (name: string) => screen.getByRole('checkbox', { name }).closest('label')!;

describe('TableView', () => {
  it('renders a table with a header row and one row per item', () => {
    render(<Harness />);
    expect(screen.getByRole('table')).toHaveClass('akds-dataview-table');
    expect(bodyRows()).toHaveLength(3);
  });

  it('renders column headers and cells with the column cell renderers', () => {
    render(<Harness />);
    expect(header('Order')).toBeInTheDocument();
    const first = bodyRows()[0]!;
    expect(within(first).getByText('Processing').closest('.akds-tag')).toBeInTheDocument();
    expect(within(first).getByText('$30.00')).toBeInTheDocument();
  });

  it('names the table and its scroll region with the caption', () => {
    render(<Harness caption="Recent orders" />);
    const table = screen.getByRole('table', { name: 'Recent orders' });
    const region = screen.getByRole('region', { name: 'Recent orders' });
    expect(region).toBe(table.parentElement);
    // Keyboard users tab to the region to scroll a wide table.
    expect(region).toHaveAttribute('tabindex', '0');
  });

  it('names the scroll region with aria-label when there is no caption', () => {
    render(<Harness aria-label="Orders" />);
    expect(screen.getByRole('table', { name: 'Orders' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Orders' })).toHaveAttribute('tabindex', '0');
  });

  it('leaves the region to the scroll area when virtualized', () => {
    const virtualizer = { getVirtualItems: () => [], getTotalSize: () => 0 };
    render(<Harness aria-label="Orders" virtualizer={virtualizer} />);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('renders the rowHeader column as row headers', () => {
    render(<Harness />);
    expect(customers()).toEqual(['Hanako Sato', 'Kenji Ito', 'Maria Garcia']);
    expect(screen.getAllByRole('rowheader')[0]).toHaveAttribute('scope', 'row');
  });

  it('only renders sort buttons for sortable columns', () => {
    render(<Harness />);
    expect(within(header('Customer')).getByRole('button')).toBeInTheDocument();
    expect(within(header('Order')).queryByRole('button')).not.toBeInTheDocument();
  });

  it('sorts, sets aria-sort on that header only, and announces the sort', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const status = screen.getByRole('status');
    expect(status).toBeEmptyDOMElement();

    await user.click(within(header('Total')).getByRole('button'));
    expect(header('Total')).toHaveAttribute('aria-sort', 'ascending');
    expect(header('Customer')).not.toHaveAttribute('aria-sort');
    expect(customers()).toEqual(['Kenji Ito', 'Maria Garcia', 'Hanako Sato']);
    expect(status).toHaveTextContent('Sorted by Order total, ascending, 3 rows.');

    await user.click(within(header('Total')).getByRole('button'));
    expect(header('Total')).toHaveAttribute('aria-sort', 'descending');
    expect(status).toHaveTextContent('Sorted by Order total, descending, 3 rows.');

    await user.click(within(header('Customer')).getByRole('button'));
    expect(header('Customer')).toHaveAttribute('aria-sort', 'ascending');
    expect(header('Total')).not.toHaveAttribute('aria-sort');
    expect(status).toHaveTextContent('Sorted by Customer, ascending, 3 rows.');
  });

  it('announces each sort once, in one live region, with a table and cards on the page', async () => {
    function BothViews() {
      const { TableView, CardView } = useDataView({ data: testOrders, columns: testColumns, getRowId: (row) => row.id });
      return (
        <>
          <TableView />
          <CardView>{(row) => <p>{row.original.customer}</p>}</CardView>
        </>
      );
    }
    const user = userEvent.setup();
    render(<BothViews />);
    expect(screen.getAllByRole('status')).toHaveLength(1);
    await user.click(within(header('Customer')).getByRole('button'));
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('Sorted by Customer, ascending, 3 rows.');
  });

  it('announces when sorting is removed', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const button = within(header('Customer')).getByRole('button');
    await user.click(button);
    await user.click(button);
    await user.click(button);
    expect(header('Customer')).not.toHaveAttribute('aria-sort');
    expect(screen.getByRole('status')).toHaveTextContent('Sorting removed, 3 rows.');
  });

  it('sorts with the keyboard', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    within(header('Customer')).getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(header('Customer')).toHaveAttribute('aria-sort', 'ascending');
    await user.keyboard(' ');
    expect(header('Customer')).toHaveAttribute('aria-sort', 'descending');
  });

  it('renders no checkboxes unless selectable', () => {
    render(<Harness />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('labels each row checkbox with the row header value', () => {
    render(<Harness selectable />);
    expect(screen.getByRole('checkbox', { name: 'Select all shown rows' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Select Hanako Sato' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Select Kenji Ito' })).toBeInTheDocument();
  });

  it('selects a row and marks the select-all checkbox indeterminate', async () => {
    const user = userEvent.setup();
    render(<Harness selectable />);
    await user.click(checkboxLabel('Select Kenji Ito'));

    expect(screen.getByRole('checkbox', { name: 'Select Kenji Ito' })).toBeChecked();
    expect(bodyRows()[1]).toHaveClass('akds-dataview-table__row--selected');
    const selectAll = screen.getByRole('checkbox', { name: 'Select all shown rows' }) as HTMLInputElement;
    expect(selectAll.indeterminate).toBe(true);
    expect(selectAll).not.toBeChecked();
  });

  it('selects and clears all rows from the header checkbox', async () => {
    const user = userEvent.setup();
    render(<Harness selectable />);
    const selectAll = screen.getByRole('checkbox', { name: 'Select all shown rows' }) as HTMLInputElement;

    await user.click(checkboxLabel('Select all shown rows'));
    expect(selectAll).toBeChecked();
    expect(selectAll.indeterminate).toBe(false);
    expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(4);

    await user.click(checkboxLabel('Select all shown rows'));
    expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(0);
  });

  it('renders rowActions in an end-aligned actions column with a hidden header', () => {
    const rowActions = vi.fn((row: { id: string; original: TestOrder }) => (
      <button type="button">Open {row.original.customer}</button>
    ));
    render(<Harness rowActions={rowActions} />);

    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument();
    const button = screen.getByRole('button', { name: 'Open Kenji Ito' });
    expect(button.parentElement).toHaveClass('akds-dataview-actions');
    const rowIds = new Set(rowActions.mock.calls.map(([row]) => (row as { id: string }).id));
    expect(rowIds).toEqual(new Set(['ORD-1', 'ORD-2', 'ORD-3']));
  });

  it('passes HTML attributes through to the table', () => {
    render(<Harness aria-label="Orders" />);
    expect(screen.getByRole('table', { name: 'Orders' })).toBeInTheDocument();
  });

  describe('axe accessibility', () => {
    it('has no violations in default state', async () => {
      const { container } = render(<Harness />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations when selectable with row actions and a row selected', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Harness selectable rowActions={(row) => <button type="button">Open {row.original.customer}</button>} />,
      );
      await user.click(checkboxLabel('Select Kenji Ito'));
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

describe('TableView with a virtualizer', () => {
  function VirtualHarness({ items, totalSize }: { items: { index: number; start: number; end: number }[]; totalSize: number }) {
    const virtualizer = {
      getVirtualItems: () => items.map((item) => ({ ...item, key: item.index })),
      getTotalSize: () => totalSize,
      measureElement: vi.fn(),
    };
    const { TableView } = useDataView({ data: testOrders, columns: testColumns, getRowId: (row) => row.id });
    return <TableView virtualizer={virtualizer} />;
  }

  it('renders only the virtual items, with row indexes and a total row count', () => {
    render(<VirtualHarness items={[{ index: 1, start: 50, end: 100 }]} totalSize={150} />);
    expect(customers()).toEqual(['Kenji Ito']);
    expect(screen.getByRole('table')).toHaveAttribute('aria-rowcount', '4');
    expect(screen.getByRole('table')).toHaveClass('akds-dataview-table--virtual');
    const row = screen.getByRole('rowheader', { name: 'Kenji Ito' }).closest('tr')!;
    expect(row).toHaveAttribute('aria-rowindex', '3');
    expect(row).toHaveAttribute('data-index', '1');
  });

  it('adds hidden spacer rows that keep the full scroll height', () => {
    const { container } = render(<VirtualHarness items={[{ index: 1, start: 50, end: 100 }]} totalSize={150} />);
    const spacers = container.querySelectorAll('.akds-dataview-table__spacer');
    expect(spacers).toHaveLength(2);
    expect(spacers[0]).toHaveAttribute('aria-hidden', 'true');
    expect(spacers[0]!.querySelector('td')).toHaveStyle({ height: '50px' });
    expect(spacers[1]!.querySelector('td')).toHaveStyle({ height: '50px' });
  });

  it('omits spacers when the visible rows reach both ends', () => {
    const { container } = render(
      <VirtualHarness
        items={[{ index: 0, start: 0, end: 50 }, { index: 1, start: 50, end: 100 }, { index: 2, start: 100, end: 150 }]}
        totalSize={150}
      />,
    );
    expect(container.querySelectorAll('.akds-dataview-table__spacer')).toHaveLength(0);
    expect(customers()).toHaveLength(3);
  });

  it('skips virtual items beyond the loaded rows', () => {
    render(<VirtualHarness items={[{ index: 2, start: 100, end: 150 }, { index: 3, start: 150, end: 200 }]} totalSize={200} />);
    expect(customers()).toEqual(['Maria Garcia']);
  });

  it('has no row count attributes without a virtualizer', () => {
    render(<Harness />);
    expect(screen.getByRole('table')).not.toHaveAttribute('aria-rowcount');
    expect(bodyRows()[0]).not.toHaveAttribute('aria-rowindex');
  });
});

describe('TableView pinned columns', () => {
  function PinnedHarness({ pinned = {} }: { pinned?: { left?: string[]; right?: string[] } }) {
    const { TableView } = useDataView({
      data: testOrders,
      columns: testColumns,
      getRowId: (row) => row.id,
      columnPinning: pinned,
    });
    return <TableView selectable rowActions={(row) => <button type="button">Open {row.original.customer}</button>} />;
  }

  const headerCell = (key: string) => document.querySelector<HTMLElement>(`thead [data-pin-key="${key}"]`)!;
  const pinnedClass = 'akds-dataview-table__pinned';

  // jsdom has no layout, so every header cell is given a fixed width.
  const stubWidths = (width: number) =>
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ width } as DOMRect);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('always pins the selection and actions columns, each as the edge of its side', () => {
    render(<PinnedHarness />);
    expect(headerCell('__select')).toHaveClass(pinnedClass, `${pinnedClass}--left`, `${pinnedClass}--edge`);
    expect(headerCell('__actions')).toHaveClass(pinnedClass, `${pinnedClass}--right`, `${pinnedClass}--edge`);
    expect(screen.getByRole('columnheader', { name: 'Order' })).not.toHaveClass(pinnedClass);
    const firstRow = bodyRows()[0]!;
    expect(firstRow.firstElementChild).toHaveClass(`${pinnedClass}--left`);
    expect(firstRow.lastElementChild).toHaveClass(`${pinnedClass}--right`);
  });

  it('pins team-configured columns next to selection and actions, moving the edge outward', () => {
    render(<PinnedHarness pinned={{ left: ['id'], right: ['total'] }} />);
    expect(headerCell('__select')).not.toHaveClass(`${pinnedClass}--edge`);
    expect(headerCell('id')).toHaveClass(`${pinnedClass}--left`, `${pinnedClass}--edge`);
    expect(headerCell('total')).toHaveClass(`${pinnedClass}--right`, `${pinnedClass}--edge`);
    expect(headerCell('__actions')).not.toHaveClass(`${pinnedClass}--edge`);
    // Pinned right columns move to the end, before actions.
    const headers = screen.getAllByRole('columnheader').map((th) => th.getAttribute('data-pin-key') ?? th.textContent);
    expect(headers.slice(-2)).toEqual(['total', '__actions']);
  });

  it('offsets each pinned column by the measured widths before it', () => {
    stubWidths(40);
    render(<PinnedHarness pinned={{ left: ['id'], right: ['total'] }} />);
    expect(headerCell('__select')).toHaveStyle({ left: '0px' });
    expect(headerCell('id')).toHaveStyle({ left: '40px' });
    expect(headerCell('__actions')).toHaveStyle({ right: '0px' });
    expect(headerCell('total')).toHaveStyle({ right: '40px' });
    const firstRowCells = bodyRows()[0]!.children;
    expect(firstRowCells[1]).toHaveStyle({ left: '40px' });
  });

  it('flags the scroll edges so shadows only show over hidden content', () => {
    // Table's wrapper scrolls horizontally (overflow-x: auto from reactkit's
    // CSS): 300px of content in a 100px viewport.
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(300);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100);
    render(<PinnedHarness />);
    const table = screen.getByRole('table');
    const wrapper = table.parentElement!;
    expect(table).toHaveClass('akds-dataview-table--scrolled-end');
    expect(table).not.toHaveClass('akds-dataview-table--scrolled-start');

    wrapper.scrollLeft = 100;
    fireEvent.scroll(wrapper);
    expect(table).toHaveClass('akds-dataview-table--scrolled-start', 'akds-dataview-table--scrolled-end');

    wrapper.scrollLeft = 200;
    fireEvent.scroll(wrapper);
    expect(table).toHaveClass('akds-dataview-table--scrolled-start');
    expect(table).not.toHaveClass('akds-dataview-table--scrolled-end');
  });

  it('re-measures offsets and scroll edges when sizes change', () => {
    const callbacks: (() => void)[] = [];
    const disconnect = vi.fn();
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: () => void) {
        callbacks.push(callback);
      }
      observe() {}
      disconnect = disconnect;
    });
    const widths = stubWidths(40);
    const { unmount } = render(<PinnedHarness pinned={{ left: ['id'] }} />);
    expect(headerCell('id')).toHaveStyle({ left: '40px' });

    // The selection column gets wider, e.g. after a font loads.
    widths.mockReturnValue({ width: 56 } as DOMRect);
    act(() => callbacks.forEach((callback) => callback()));
    expect(headerCell('id')).toHaveStyle({ left: '56px' });

    unmount();
    expect(disconnect).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('flags no scroll edges when the table fits', () => {
    render(<PinnedHarness />);
    const table = screen.getByRole('table');
    expect(table).not.toHaveClass('akds-dataview-table--scrolled-start');
    expect(table).not.toHaveClass('akds-dataview-table--scrolled-end');
  });
});

describe('TableView loading', () => {
  function Empty(props: TableViewProps<TestOrder>) {
    const { TableView } = useDataView<TestOrder>({ data: [], columns: testColumns, getRowId: (row) => row.id });
    return <TableView {...props} />;
  }

  it('shows the loading state instead of "No results." while there are no rows', () => {
    render(<Empty loading />);
    expect(screen.getByText('Loading…').closest('td')).toHaveClass('akds-dataview-table__loading');
    expect(screen.queryByText('No results.')).not.toBeInTheDocument();
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
  });

  it('shows "No results." once loading ends with no rows', () => {
    const { rerender } = render(<Empty loading />);
    rerender(<Empty />);
    expect(screen.getByText('No results.')).toBeInTheDocument();
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
    expect(screen.getByRole('table')).not.toHaveAttribute('aria-busy');
  });

  it('keeps the rows shown, marked as refreshing, while loading rows that replace them', () => {
    render(<Harness loading />);
    expect(bodyRows()).toHaveLength(3);
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading more…')).not.toBeInTheDocument();
    expect(screen.getByRole('table')).toHaveClass('akds-dataview-table--refreshing');
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
  });

  it('is not marked as refreshing while showing the loading state', () => {
    render(<Empty loading />);
    expect(screen.getByRole('table')).not.toHaveClass('akds-dataview-table--refreshing');
  });

  it('stops refreshing once loading ends', () => {
    const { rerender } = render(<Harness loading />);
    rerender(<Harness />);
    expect(screen.getByRole('table')).not.toHaveClass('akds-dataview-table--refreshing');
    expect(screen.getByRole('table')).not.toHaveAttribute('aria-busy');
  });

  it('has no axe violations while loading', async () => {
    const { container } = render(<Empty loading />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations while refreshing', async () => {
    const { container } = render(<Harness loading />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('TableView loadingMore', () => {
  function Empty(props: TableViewProps<TestOrder>) {
    const { TableView } = useDataView<TestOrder>({ data: [], columns: testColumns, getRowId: (row) => row.id });
    return <TableView {...props} />;
  }

  it('shows "Loading more…" after the last row, without refreshing', () => {
    render(<Harness loadingMore />);
    const rows = bodyRows();
    expect(rows).toHaveLength(4);
    expect(within(rows[3]!).getByText('Loading more…')).toBeInTheDocument();
    expect(rows[3]!.querySelector('td')).toHaveClass('akds-dataview-table__loading-more');
    expect(rows[3]!.querySelector('td')).toHaveAttribute('colspan', String(testColumns.length));
    expect(screen.getByRole('table')).not.toHaveClass('akds-dataview-table--refreshing');
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
  });

  it('shows the loading state while there are no rows', () => {
    render(<Empty loadingMore />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(screen.queryByText('Loading more…')).not.toBeInTheDocument();
    expect(screen.queryByText('No results.')).not.toBeInTheDocument();
  });

  it('gives way to loading when both are set', () => {
    render(<Harness loading loadingMore />);
    expect(screen.queryByText('Loading more…')).not.toBeInTheDocument();
    expect(screen.getByRole('table')).toHaveClass('akds-dataview-table--refreshing');
  });

  it('removes the indicator once loading more ends', () => {
    const { rerender } = render(<Harness loadingMore />);
    rerender(<Harness />);
    expect(screen.queryByText('Loading more…')).not.toBeInTheDocument();
    expect(bodyRows()).toHaveLength(3);
    expect(screen.getByRole('table')).not.toHaveAttribute('aria-busy');
  });

  it('has no axe violations while loading more', async () => {
    const { container } = render(<Harness loadingMore selectable />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('TableView held height', () => {
  // jsdom has no layout: rows measure 240px and "No results." 80px.
  let rectSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    rectSpy = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      const height = this.querySelector('.akds-dataview-table__empty') ? 80 : 240;
      return { height, width: 0, top: 0, left: 0, right: 0, bottom: height, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
    });
  });
  afterEach(() => rectSpy.mockRestore());

  function Switching({ rows, ...props }: TableViewProps<TestOrder> & { rows: TestOrder[] }) {
    const { TableView } = useDataView<TestOrder>({ data: rows, columns: testColumns, getRowId: (row) => row.id });
    return <TableView {...props} />;
  }
  const stateRow = () => screen.getByText(/Loading…|Couldn’t load|No results\./).closest('tr')!;

  it('keeps the rows\' height when they give way to the error state', () => {
    const { rerender } = render(<Switching rows={testOrders} />);
    rerender(<Switching rows={[]} error="Couldn’t load orders." />);
    expect(stateRow()).toHaveStyle({ '--akds-dataview-held-height': '240px' });
  });

  it('keeps the same height through a retry, from error to loading', () => {
    const { rerender } = render(<Switching rows={testOrders} />);
    rerender(<Switching rows={[]} error="Couldn’t load orders." />);
    rerender(<Switching rows={[]} loading error="Couldn’t load orders." />);
    expect(screen.getByText('Loading…').closest('tr')).toHaveStyle({ '--akds-dataview-held-height': '240px' });
  });

  it('keeps the rows\' height when they give way to the loading state', () => {
    const { rerender } = render(<Switching rows={testOrders} />);
    rerender(<Switching rows={[]} loading />);
    expect(stateRow()).toHaveStyle({ '--akds-dataview-held-height': '240px' });
  });

  it('holds the height shown just before, so loading after "No results." stays short', () => {
    const { rerender } = render(<Switching rows={testOrders} />);
    rerender(<Switching rows={[]} />);
    expect(stateRow().style.getPropertyValue('--akds-dataview-held-height')).toBe('');
    rerender(<Switching rows={[]} loading />);
    expect(stateRow()).toHaveStyle({ '--akds-dataview-held-height': '80px' });
  });

  it('does not hold a height on the first load', () => {
    render(<Switching rows={[]} loading />);
    expect(stateRow().style.getPropertyValue('--akds-dataview-held-height')).toBe('');
  });
});
