import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { useDataView } from '../../useDataView/useDataView';
import type { SearchProps } from '../../Search/Search.types';
import { testColumns, testOrders } from '../fixtures/orders';

expect.extend(toHaveNoViolations);

function Harness(props: Partial<SearchProps>) {
  const { Search, TableView } = useDataView({ data: testOrders, columns: testColumns, getRowId: (row) => row.id });
  return (
    <>
      <Search label="Search orders" {...props} />
      <TableView />
    </>
  );
}

const input = () => screen.getByRole('searchbox', { name: 'Search orders' });
const type = (value: string) => fireEvent.change(input(), { target: { value } });
const customers = () => screen.queryAllByRole('rowheader').map((cell) => cell.textContent);
// useDataView's one live region, shared by every DataView component.
const announcement = () => document.querySelector('body > [role="status"]');

describe('Search', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a labelled search field with a decorative icon', () => {
    render(<Harness />);
    expect(input()).toHaveAttribute('type', 'search');
    expect(input().closest('.akds-dataview-search')?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('filters across all columns by default', () => {
    render(<Harness />);
    type('shipped');
    expect(customers()).toEqual(['Kenji Ito']);
    type('ORD-3');
    expect(customers()).toEqual(['Maria Garcia']);
  });

  it('filters one column when column is set', () => {
    render(<Harness column="customer" />);
    type('ORD-3');
    expect(customers()).toEqual([]);
    type('garcia');
    expect(customers()).toEqual(['Maria Garcia']);
    expect(input()).toHaveValue('garcia');
  });

  it('clears the filter when the input is cleared', () => {
    render(<Harness />);
    type('ito');
    expect(customers()).toHaveLength(1);
    type('');
    expect(customers()).toHaveLength(3);
    expect(input()).toHaveValue('');
  });

  it('shows an empty state when nothing matches', () => {
    render(<Harness />);
    type('zzz');
    expect(screen.getByRole('cell', { name: 'No results.' })).toHaveAttribute('colspan', '4');
  });

  it('announces the result count once typing pauses', () => {
    vi.useFakeTimers();
    render(<Harness />);
    type('a');
    type('ar');
    expect(announcement()).toBeEmptyDOMElement();
    act(() => vi.advanceTimersByTime(500));
    expect(announcement()).toHaveTextContent('1 result.');

    type('o');
    act(() => vi.advanceTimersByTime(500));
    expect(announcement()).toHaveTextContent('3 results.');

    type('zzz');
    act(() => vi.advanceTimersByTime(500));
    expect(announcement()).toHaveTextContent('No results.');

    // Clearing the search announces nothing new.
    type('');
    act(() => vi.advanceTimersByTime(500));
    expect(announcement()).toHaveTextContent('No results.');
  });

  it('announces a repeated count again, after clearing it briefly', () => {
    vi.useFakeTimers();
    render(<Harness />);
    type('o');
    act(() => vi.advanceTimersByTime(500));
    expect(announcement()).toHaveTextContent('3 results.');

    // A different search with the same count (matching is case-insensitive):
    // the text is cleared, then set again, so screen readers hear it.
    type('O');
    act(() => vi.advanceTimersByTime(500));
    expect(announcement()).toBeEmptyDOMElement();
    act(() => vi.advanceTimersByTime(100));
    expect(announcement()).toHaveTextContent('3 results.');
  });

  it('passes other props to the text input', () => {
    render(<Harness placeholder="Name, status, or order" helperText="Matches any column" />);
    expect(input()).toHaveAttribute('placeholder', 'Name, status, or order');
    expect(screen.getByText('Matches any column')).toBeInTheDocument();
  });

  describe('axe accessibility', () => {
    it('has no violations', async () => {
      const { container } = render(<Harness />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
