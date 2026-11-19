import React, { Profiler } from 'react';
import { describe, it, expect } from 'vitest';
import { act, render, renderHook, screen } from '@testing-library/react';
import { useDataView } from '../../useDataView/useDataView';
import { testColumns, testOrders } from '../fixtures/orders';

describe('useDataView', () => {
  it('settles when data is a new empty array on every render', async () => {
    // `data ?? []` makes a new array each render. Without a shared empty
    // array, TanStack treats each one as new data and renders again, forever.
    function Host({ hasRows, loading }: { hasRows: boolean; loading: boolean }) {
      const { TableView } = useDataView({
        data: hasRows ? testOrders : [],
        columns: testColumns,
        getRowId: (row) => row.id,
      });
      return <TableView aria-label="Orders" loading={loading} />;
    }
    let commits = 0;
    const onRender = () => {
      commits += 1;
    };
    const pause = () => act(() => new Promise((resolve) => setTimeout(resolve, 100)));
    const show = (props: { hasRows: boolean; loading: boolean }) => (
      <Profiler id="host" onRender={onRender}><Host {...props} /></Profiler>
    );
    // Loading, then refreshing with rows, then empty: the steps that looped.
    const { rerender } = render(show({ hasRows: false, loading: true }));
    rerender(show({ hasRows: true, loading: true }));
    await pause();
    rerender(show({ hasRows: false, loading: false }));
    await pause();
    const settled = commits;
    await pause();
    expect(commits).toBe(settled);
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  const options = { data: testOrders, columns: testColumns, getRowId: (row: { id: string }) => row.id };

  it('returns the table instance as tableSource', () => {
    const { result } = renderHook(() => useDataView(options));
    expect(result.current.tableSource.getRowModel().rows).toHaveLength(3);
  });

  it('returns views with stable identities and display names', () => {
    const { result, rerender } = renderHook(() => useDataView(options));
    const first = result.current.TableView;
    rerender();
    expect(result.current.TableView).toBe(first);
    expect(first.displayName).toBe('TableView');
  });

  it('does not remount a view when the host re-renders', () => {
    function Host({ tick }: { tick: number }) {
      const { TableView } = useDataView(options);
      return (
        <>
          <span>{tick}</span>
          <TableView />
        </>
      );
    }
    const { rerender } = render(<Host tick={0} />);
    const table = screen.getByRole('table');
    rerender(<Host tick={1} />);
    expect(screen.getByRole('table')).toBe(table);
  });
});
