import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { Row, Table } from '@tanstack/react-table';
import {
  DataViewContext,
  RowContext,
  useDataViewInstance,
  useDataViewRow,
} from '../../headless/context';
import type { DataViewContextValue, RowContextValue } from '../../headless/context';

describe('headless context', () => {
  // React logs the expected render error to the console, and jsdom reports it
  // as an uncaught window error; silence both to keep test output clean.
  const silenceErrors = () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onWindowError = (e: ErrorEvent) => e.preventDefault();
    window.addEventListener('error', onWindowError);
    return {
      mockRestore: () => {
        consoleSpy.mockRestore();
        window.removeEventListener('error', onWindowError);
      },
    };
  };

  it('useDataViewInstance throws a helpful error outside a view', () => {
    const spy = silenceErrors();
    expect(() => renderHook(() => useDataViewInstance())).toThrow(
      'This component must be used inside a view returned by useDataView.',
    );
    spy.mockRestore();
  });

  it('useDataViewRow throws a helpful error outside CardView', () => {
    const spy = silenceErrors();
    expect(() => renderHook(() => useDataViewRow())).toThrow(
      'DataViewCard and DataViewField must be used inside CardView.',
    );
    spy.mockRestore();
  });

  it('useDataViewInstance returns the provided value', () => {
    const value = { table: {} as Table<unknown>, state: {} } as DataViewContextValue;
    const { result } = renderHook(() => useDataViewInstance(), {
      wrapper: ({ children }) => <DataViewContext.Provider value={value}>{children}</DataViewContext.Provider>,
    });
    expect(result.current).toBe(value);
  });

  it('useDataViewRow returns the provided value', () => {
    const value: RowContextValue = {
      row: {} as Row<unknown>,
      selectable: true,
      cardActions: undefined,
      cardActionsPlacement: 'header',
      tabIndex: 0,
    };
    const { result } = renderHook(() => useDataViewRow(), {
      wrapper: ({ children }) => <RowContext.Provider value={value}>{children}</RowContext.Provider>,
    });
    expect(result.current).toBe(value);
  });
});
