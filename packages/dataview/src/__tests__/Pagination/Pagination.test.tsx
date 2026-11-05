import React from 'react';
import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { useDataView } from '../../useDataView/useDataView';
import type { PaginationProps } from '../../Pagination/Pagination.types';
import { testColumns } from '../fixtures/orders';
import type { TestOrder } from '../fixtures/orders';

expect.extend(toHaveNoViolations);

// 25 rows: pages of 10, 10, and 5. Customers are numbered so the sort
// order matches the id order.
const manyOrders: TestOrder[] = Array.from({ length: 25 }, (_, i) => ({
  id: `ORD-${i + 1}`,
  customer: `Customer ${String(i + 1).padStart(2, '0')}`,
  status: i % 2 === 0 ? 'Processing' : 'Shipped',
  total: i + 1,
}));

function Harness({ paged = true, ...props }: Partial<PaginationProps> & { paged?: boolean }) {
  const { Search, TableView, Pagination } = useDataView({
    data: manyOrders,
    columns: testColumns,
    getRowId: (row) => row.id,
    ...(paged ? { pageSize: 10 } : {}),
  });
  return (
    <>
      <Search label="Search orders" />
      <TableView selectable />
      <Pagination {...props} />
    </>
  );
}

const customers = () => screen.queryAllByRole('rowheader').map((cell) => cell.textContent);
const summary = () => document.querySelector('.akds-dataview-pagination__summary')?.textContent;
const announcement = () => document.querySelector('.akds-dataview-pagination [role="status"]')?.textContent;

describe('Pagination', () => {
  it('shows the first page of rows with a range summary', () => {
    render(<Harness />);
    expect(customers()).toHaveLength(10);
    expect(customers()[0]).toBe('Customer 01');
    expect(summary()).toBe('1–10 of 25');
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument();
  });

  it('moves between pages with page and arrow buttons', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(customers()).toEqual(['Customer 21', 'Customer 22', 'Customer 23', 'Customer 24', 'Customer 25']);
    expect(summary()).toBe('21–25 of 25');
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(customers()[0]).toBe('Customer 11');
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('announces the new page after a page change', async () => {
    render(<Harness />);
    expect(announcement()).toBe('');
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(announcement()).toBe('Page 2 of 3, showing rows 11–20 of 25.');
  });

  it('returns to the first page and recounts when a search filters rows', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search orders' }), { target: { value: 'Shipped' } });
    expect(summary()).toBe('1–10 of 12');
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('button', { name: 'Page 3' })).not.toBeInTheDocument();
  });

  it('returns to the first page when sorting changes', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    await userEvent.click(screen.getByRole('button', { name: /Customer/ }));
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
  });

  it('selects only the current page from the header checkbox', async () => {
    render(<Harness />);
    // The input is visually replaced, so click its label like a user would.
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select all shown rows' }).closest('label')!);
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByRole('checkbox', { name: 'Select all shown rows' })).not.toBeChecked();
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(screen.getByRole('checkbox', { name: 'Select all shown rows' })).toBeChecked();
  });

  it('renders nothing without pageSize, and shows every row', () => {
    render(<Harness paged={false} />);
    expect(customers()).toHaveLength(25);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders nothing when no rows match', () => {
    render(<Harness />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search orders' }), { target: { value: 'no such order' } });
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('passes aria-label to the landmark and other attributes to the wrapper', () => {
    render(<Harness aria-label="Orders pages" className="custom" data-testid="pager" />);
    expect(screen.getByRole('navigation', { name: 'Orders pages' })).toBeInTheDocument();
    expect(screen.getByTestId('pager')).toHaveClass('akds-dataview-pagination', 'custom');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Harness />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
