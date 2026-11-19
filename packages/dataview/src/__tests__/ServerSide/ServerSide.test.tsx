import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { useDataView } from '../../useDataView/useDataView';
import type { DataViewQuery } from '../../headless';
import { testColumns } from '../fixtures/orders';
import type { TestOrder } from '../fixtures/orders';

expect.extend(toHaveNoViolations);

// 25 rows on the "server": pages of 10, 10, and 5.
const serverOrders: TestOrder[] = Array.from({ length: 25 }, (_, i) => ({
  id: `ORD-${i + 1}`,
  customer: `Customer ${String(i + 1).padStart(2, '0')}`,
  status: i % 2 === 0 ? 'Processing' : 'Shipped',
  total: i + 1,
}));

const INITIAL_QUERY: DataViewQuery = { pageIndex: 0, pageSize: 10, sorting: [], globalFilter: undefined, columnFilters: [] };

// Answers synchronously, so each query's rows arrive on the next render.
function serve(query: DataViewQuery) {
  const search = query.globalFilter?.toLowerCase();
  let rows = serverOrders.filter((order) => !search || order.customer.toLowerCase().includes(search));
  const [sort] = query.sorting;
  if (sort) {
    const key = sort.id as keyof TestOrder;
    rows = [...rows].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0) * (sort.desc ? -1 : 1));
  }
  const start = query.pageIndex * query.pageSize;
  return { orders: rows.slice(start, start + query.pageSize), total: rows.length };
}

function ServerHarness({ onQueryChange, onExport }: { onQueryChange?: (query: DataViewQuery) => void; onExport?: (rows: TestOrder[]) => void }) {
  const [query, setQuery] = React.useState(INITIAL_QUERY);
  const result = React.useMemo(() => serve(query), [query]);
  const { TableView, Search, BulkActions, Pagination } = useDataView({
    data: result.orders,
    columns: testColumns,
    getRowId: (row) => row.id,
    serverSide: true,
    rowCount: result.total,
    pageSize: 10,
    onQueryChange: (next) => {
      onQueryChange?.(next);
      setQuery(next);
    },
  });
  return (
    <>
      <Search label="Search orders" />
      <BulkActions variant="button" actions={[{ label: 'Export', onSelect: onExport ?? (() => {}) }]} />
      <TableView selectable />
      <Pagination />
    </>
  );
}

// Data that never changes, to check what DataView does (and doesn't do) on its own.
function StaticHarness({ data, rowCount = 25, onQueryChange }: { data: TestOrder[]; rowCount?: number; onQueryChange?: (query: DataViewQuery) => void }) {
  const { TableView, Search, Pagination } = useDataView({
    data,
    columns: testColumns,
    getRowId: (row) => row.id,
    serverSide: true,
    rowCount,
    pageSize: 10,
    ...(onQueryChange ? { onQueryChange } : {}),
  });
  return (
    <>
      <Search label="Search orders" />
      <TableView />
      <Pagination />
    </>
  );
}

const customers = () => screen.queryAllByRole('rowheader').map((cell) => cell.textContent);
const pagerSummary = () => document.querySelector('.akds-dataview-pagination__summary')?.textContent;
const bulkSummary = () => document.querySelector('.akds-dataview-bulk-actions__summary');
// useDataView's one live region, shared by every DataView component.
const searchAnnouncement = () => document.querySelector('body > [role="status"]')?.textContent;
const selectRow = (name: string) => fireEvent.click(screen.getByRole('checkbox', { name: `Select ${name}` }));

describe('serverSide', () => {
  it('does not call onQueryChange on the first render', () => {
    const onQueryChange = vi.fn();
    render(<ServerHarness onQueryChange={onQueryChange} />);
    expect(onQueryChange).not.toHaveBeenCalled();
  });

  it('calls onQueryChange with the new page', async () => {
    const onQueryChange = vi.fn();
    render(<ServerHarness onQueryChange={onQueryChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(onQueryChange).toHaveBeenCalledTimes(1);
    expect(onQueryChange).toHaveBeenCalledWith({ ...INITIAL_QUERY, pageIndex: 1 });
    expect(customers()[0]).toBe('Customer 11');
  });

  it('sends a sort change with the first page, in one call', async () => {
    const onQueryChange = vi.fn();
    render(<ServerHarness onQueryChange={onQueryChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    onQueryChange.mockClear();
    await userEvent.click(screen.getByRole('button', { name: /Customer/ }));
    expect(onQueryChange).toHaveBeenCalledTimes(1);
    expect(onQueryChange).toHaveBeenCalledWith({ ...INITIAL_QUERY, sorting: [{ id: 'customer', desc: false }] });
  });

  it('sends the search text', () => {
    const onQueryChange = vi.fn();
    render(<ServerHarness onQueryChange={onQueryChange} />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search orders' }), { target: { value: 'Customer 1' } });
    expect(onQueryChange).toHaveBeenLastCalledWith({ ...INITIAL_QUERY, globalFilter: 'Customer 1' });
    expect(pagerSummary()).toBe('1–10 of 10');
  });

  it('shows data as given, without sorting, filtering, or paging it again', async () => {
    const reversed = [...serverOrders].reverse();
    render(<StaticHarness data={reversed} />);
    // All 25 given rows show: the server already chose the page.
    expect(customers()).toHaveLength(25);
    await userEvent.click(screen.getByRole('button', { name: /Customer/ }));
    expect(customers()[0]).toBe('Customer 25');
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search orders' }), { target: { value: 'Customer 01' } });
    expect(customers()).toHaveLength(25);
  });

  it('counts pages and the range from rowCount', () => {
    render(<StaticHarness data={serverOrders.slice(0, 10)} rowCount={243} />);
    expect(pagerSummary()).toBe('1–10 of 243');
    expect(screen.getByRole('button', { name: 'Page 25' })).toBeInTheDocument();
  });

  it('keeps Pagination while there are no rows but the server has some, e.g. after a failed request', () => {
    render(<StaticHarness data={[]} rowCount={25} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('hides Pagination when the server has no rows', () => {
    render(<StaticHarness data={[]} rowCount={0} />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  describe('Search announcements', () => {
    it('announces the count once the new results arrive', () => {
      render(<ServerHarness />);
      fireEvent.change(screen.getByRole('searchbox', { name: 'Search orders' }), { target: { value: 'Customer 1' } });
      expect(searchAnnouncement()).toBe('10 results.');
    });

    it('does not announce the previous count while results are on their way', () => {
      render(<StaticHarness data={serverOrders.slice(0, 10)} />);
      fireEvent.change(screen.getByRole('searchbox', { name: 'Search orders' }), { target: { value: 'Customer 1' } });
      expect(searchAnnouncement()).toBe('');
    });

    it('does not announce a page change as search results', async () => {
      render(<ServerHarness />);
      fireEvent.change(screen.getByRole('searchbox', { name: 'Search orders' }), { target: { value: 'Customer' } });
      expect(searchAnnouncement()).toBe('25 results.');
      await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
      // Only Pagination's own announcement, not the search count again.
      expect(searchAnnouncement()).toMatch(/^Page 2 of 3/);
    });
  });

  describe('selection', () => {
    it('keeps rows selected on other pages and counts them', async () => {
      render(<ServerHarness />);
      selectRow('Customer 01');
      await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
      selectRow('Customer 11');
      expect(bulkSummary()).toHaveTextContent('2 selected');
      await userEvent.click(screen.getByRole('button', { name: 'Page 1' }));
      expect(screen.getByRole('checkbox', { name: 'Select Customer 01' })).toBeChecked();
    });

    it('gives bulk actions the data of rows selected on other pages', async () => {
      const onExport = vi.fn();
      render(<ServerHarness onExport={onExport} />);
      selectRow('Customer 01');
      await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
      selectRow('Customer 11');
      await userEvent.click(screen.getByRole('button', { name: 'Export' }));
      expect(onExport).toHaveBeenCalledWith([serverOrders[0], serverOrders[10]]);
    });

    it('drops deselected rows from bulk actions', async () => {
      const onExport = vi.fn();
      render(<ServerHarness onExport={onExport} />);
      selectRow('Customer 01');
      selectRow('Customer 02');
      selectRow('Customer 01');
      await userEvent.click(screen.getByRole('button', { name: 'Export' }));
      expect(onExport).toHaveBeenCalledWith([serverOrders[1]]);
    });

    it('shows the server total and no Select all button', () => {
      render(<ServerHarness />);
      expect(bulkSummary()).toHaveTextContent('25 rows');
      expect(document.querySelector('.akds-dataview-bulk-actions__select-all')).not.toBeInTheDocument();
    });

    it('moves focus to the summary after Clear selection', async () => {
      render(<ServerHarness />);
      selectRow('Customer 01');
      await userEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
      expect(bulkSummary()).toHaveFocus();
      expect(bulkSummary()).toHaveTextContent('25 rows');
    });
  });

  it('has no axe violations', async () => {
    const { container } = render(<ServerHarness />);
    selectRow('Customer 01');
    expect(await axe(container)).toHaveNoViolations();
  });
});
