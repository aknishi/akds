import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ColumnDef } from '@tanstack/react-table';
import { useDataViewCore } from '../../headless/useDataViewCore';
import { getColumnLabel, getRowLabel } from '../../headless/labels';

interface Person {
  id: string;
  name: string;
  age: number;
}

const data: Person[] = [
  { id: 'p1', name: 'Hanako Sato', age: 34 },
  { id: 'p2', name: 'Kenji Ito', age: 28 },
  { id: 'p3', name: 'Maria Garcia', age: 41 },
];

const columns: ColumnDef<Person, any>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name', enableSorting: true },
  { accessorKey: 'age', header: () => 'Age', enableSorting: true, meta: { ariaLabel: 'Age in years' } },
];

const setup = (withRowId = true) =>
  renderHook(() =>
    useDataViewCore({ data, columns, ...(withRowId ? { getRowId: (row: Person) => row.id } : {}) }),
  );

const names = (table: ReturnType<typeof setup>['result']['current']) =>
  table.getRowModel().rows.map((row) => row.original.name);

describe('useDataViewCore', () => {
  it('creates a row for each item, keyed by getRowId', () => {
    const { result } = setup();
    expect(result.current.getRowModel().rows.map((row) => row.id)).toEqual(['p1', 'p2', 'p3']);
  });

  it('falls back to index row ids without getRowId', () => {
    const { result } = setup(false);
    expect(result.current.getRowModel().rows.map((row) => row.id)).toEqual(['0', '1', '2']);
  });

  it('only lets columns that opt in be sorted', () => {
    const { result } = setup();
    expect(result.current.getColumn('id')?.getCanSort()).toBe(false);
    expect(result.current.getColumn('name')?.getCanSort()).toBe(true);
    expect(result.current.getColumn('age')?.getCanSort()).toBe(true);
  });

  it('sorts rows', () => {
    const { result } = setup();
    act(() => result.current.getColumn('name')?.toggleSorting(true));
    expect(names(result.current)).toEqual(['Maria Garcia', 'Kenji Ito', 'Hanako Sato']);
  });

  it('filters rows by column value', () => {
    const { result } = setup();
    act(() => result.current.getColumn('name')?.setFilterValue('ito'));
    expect(names(result.current)).toEqual(['Kenji Ito']);
  });

  it('enables row selection', () => {
    const { result } = setup();
    act(() => result.current.getRow('p2').toggleSelected(true));
    expect(result.current.getSelectedRowModel().rows.map((row) => row.id)).toEqual(['p2']);
  });

  it('sorts ascending first, including number columns', () => {
    const { result } = setup();
    act(() => result.current.getColumn('age')?.toggleSorting());
    expect(result.current.getState().sorting).toEqual([{ id: 'age', desc: false }]);
  });

  it('sorts by one column at a time', () => {
    const { result } = setup();
    act(() => result.current.getColumn('name')?.toggleSorting(false));
    act(() => result.current.getColumn('age')?.toggleSorting(false, true));
    expect(result.current.getState().sorting).toEqual([{ id: 'age', desc: false }]);
  });

  it('keeps the same table instance across renders', () => {
    const { result, rerender } = setup();
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});

describe('getColumnLabel', () => {
  it('prefers meta.ariaLabel, then a string header, then the column id', () => {
    const { result } = renderHook(() =>
      useDataViewCore({
        data,
        columns: [...columns, { accessorKey: 'id', id: 'raw', header: () => 'Raw' }],
      }),
    );
    const label = (id: string) => getColumnLabel(result.current.getColumn(id)!);
    expect(label('age')).toBe('Age in years');
    expect(label('name')).toBe('Name');
    expect(label('raw')).toBe('raw');
  });
});

describe('getRowLabel', () => {
  it('uses the rowHeader column value, falling back to the row id', () => {
    const withRowHeader: ColumnDef<Person, any>[] = [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Name', meta: { rowHeader: true } },
    ];
    const { result: labelled } = renderHook(() =>
      useDataViewCore({ data, columns: withRowHeader, getRowId: (row) => row.id }),
    );
    expect(getRowLabel(labelled.current.getRow('p1'))).toBe('Hanako Sato');

    const { result: unlabelled } = renderHook(() =>
      useDataViewCore({ data, columns, getRowId: (row) => row.id }),
    );
    expect(getRowLabel(unlabelled.current.getRow('p1'))).toBe('p1');
  });
});
