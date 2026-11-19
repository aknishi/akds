import React from 'react';
import clsx from 'clsx';
import type { SearchProps } from './Search.types';
import { TextInput } from '@aknishi/akds-reactkit';
import { SearchIcon } from '@aknishi/akds-icons';
import { useDataViewInstance } from '../headless';
import { useAnnounce } from '../headless/announcer';
import { makePrefixer } from '../utils';

const withBaseName = makePrefixer('akds-dataview-search');

const ANNOUNCE_DELAY_MS = 500;

export function Search<TData>({ label, column, className, ...rest }: SearchProps) {
  const { table, state } = useDataViewInstance<TData>();
  const targetColumn = column ? table.getColumn(column) : undefined;
  const rawValue = targetColumn ? targetColumn.getFilterValue() : state.globalFilter;
  const value = typeof rawValue === 'string' ? rawValue : '';
  // Server-side, the server's count of matching rows.
  const serverSide = table.options.manualFiltering === true;
  const resultCount = serverSide ? table.getRowCount() : table.getFilteredRowModel().rows.length;
  const announce = useAnnounce();
  const awaitingResultsRef = React.useRef(false);
  const resultsLabel = resultCount === 0 ? 'No results.' : `${resultCount} ${resultCount === 1 ? 'result' : 'results'}.`;

  // Results update silently as the user types, so screen-reader users hear
  // the count once typing pauses instead of after every keystroke.
  React.useEffect(() => {
    if (serverSide || !value) return undefined;
    const timer = setTimeout(() => announce(resultsLabel), ANNOUNCE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [value, resultCount]);

  // Server-side, a count announced after a pause in typing would be the
  // previous search's, since the new results are still on their way. The
  // count is announced when the next data arrives instead (the team waits
  // for typing to pause before fetching), and only after a search change,
  // not after a page change.
  const data = table.options.data;
  React.useEffect(() => {
    if (!serverSide) return;
    awaitingResultsRef.current = Boolean(value);
  }, [value]);
  React.useEffect(() => {
    if (!serverSide || !awaitingResultsRef.current) return;
    // No rows while the server still reports matches: the request failed,
    // and the view's error state announces that instead.
    if (table.getRowModel().rows.length === 0 && resultCount > 0) return;
    awaitingResultsRef.current = false;
    announce(resultsLabel);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // An empty string still counts as a filter value; undefined clears it.
    const next = e.target.value || undefined;
    if (targetColumn) targetColumn.setFilterValue(next);
    else table.setGlobalFilter(next);
  };

  return (
    <div className={clsx(withBaseName(), className)}>
      <TextInput
        type="search"
        label={label}
        value={value}
        onChange={handleChange}
        startAdornment={<SearchIcon aria-hidden="true" />}
        {...rest}
      />
    </div>
  );
}

Search.displayName = 'Search';
