import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, renderHook, screen } from '@testing-library/react';
import { useDataView } from '../../useDataView/useDataView';
import { testColumns, testOrders } from '../fixtures/orders';

describe('useDataView', () => {
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
