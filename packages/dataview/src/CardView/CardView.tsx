import React from 'react';
import clsx from 'clsx';
import '../styles/variables.css';
import './CardView.css';
import '../styles/refreshing.css';
import type { CardViewProps } from './CardView.types';
import { Checkbox, VisuallyHidden } from '@aknishi/akds-reactkit';
import { RowContext, useDataViewInstance, activateRow } from '../headless';
import type { RowContextValue } from '../headless';
import { useSortAnnouncement } from '../headless/useSortAnnouncement';
import { CARD_ROW_ID_ATTRIBUTE } from '../DataViewCard/cardRowId';
import { SortMenu } from '../SortMenu';
import { DataViewLoadingMore, DataViewStateContent, getDataViewStatus, useDataViewStateFocus, useHeldHeight } from '../DataViewState';
import { makePrefixer } from '../utils';

const withBaseName = makePrefixer('akds-dataview-cards');

const CARD_SELECTOR = `[${CARD_ROW_ID_ATTRIBUTE}]`;

export function CardView<TData>({
  selectable = false,
  loading = false,
  loadingMore = false,
  error,
  onRetry,
  loadingState,
  errorState,
  emptyState,
  cardActions,
  cardActionsPlacement = 'header',
  rowClickOptions,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  ...rest
}: CardViewProps<TData>) {
  const { table, state } = useDataViewInstance<TData>();
  const rows = table.getRowModel().rows;
  const sortMessage = useSortAnnouncement(table, state.sorting);
  const sortable = table.getAllLeafColumns().some((column) => column.getCanSort());
  const [activeRowId, setActiveRowId] = React.useState<string | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const status = getDataViewStatus(rows.length, { loading, loadingMore, error });
  // With cards shown, loading replaces them and loading more adds to them.
  // Loading wins: cards about to be replaced don't need a load-more indicator.
  const refreshing = loading && !status;
  const showLoadingMore = loadingMore && !loading && !status;
  // Measures the list or the state, whichever is shown, so a state keeps the
  // height of what it replaced.
  const { contentRef, heldHeight } = useHeldHeight<HTMLElement>(status);
  const setListRef = React.useCallback((node: HTMLUListElement | null) => {
    listRef.current = node;
    contentRef.current = node;
  }, [contentRef]);
  // Once cards replace a state that had focus, the card in the tab order
  // takes it, so keyboard users start from the new cards.
  const stateFocus = useDataViewStateFocus(status, () => {
    listRef.current?.querySelector<HTMLElement>(`${CARD_SELECTOR}[tabindex="0"]`)?.focus();
  });
  // If the active card was sorted or filtered away, the first card takes its
  // place so the list always has exactly one tab stop.
  const tabStopRowId = rows.some((row) => row.id === activeRowId) ? activeRowId : rows[0]?.id;

  // Keeps the tab stop on whichever card the user last focused, whether they
  // got there by arrow key, Tab, or clicking into the card's controls.
  const handleFocus = (e: React.FocusEvent<HTMLUListElement>) => {
    const card = (e.target as Element).closest<HTMLElement>(CARD_SELECTOR);
    const rowId = card?.getAttribute(CARD_ROW_ID_ATTRIBUTE);
    if (rowId) setActiveRowId(rowId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement;
    // Arrow keys only move between cards when a card itself has focus, so
    // they keep working normally inside checkboxes, menus, and accordions.
    if (!target.matches(CARD_SELECTOR)) return;
    const cards = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(CARD_SELECTOR));
    const index = cards.indexOf(target);
    const nextIndex = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: cards.length - 1,
    }[e.key];
    if (nextIndex === undefined) return;
    e.preventDefault();
    cards[Math.min(Math.max(nextIndex, 0), cards.length - 1)]?.focus();
  };

  // The frame and header mirror TableView's: a header bar in Th's style
  // holds what the table puts in its column headers, select all and sorting.
  return (
    <div
      className={clsx(withBaseName(), { [withBaseName('refreshing')]: refreshing }, className)}
      aria-busy={loading || loadingMore || undefined}
      {...rest}
    >
      {(selectable || sortable) && (
        <div className={withBaseName.el('header')}>
          {selectable && (
            <Checkbox
              label={<VisuallyHidden>Select all shown rows</VisuallyHidden>}
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={table.getIsSomePageRowsSelected()}
              // "Page rows" are the rows currently shown, so select all
              // never selects rows hidden by a search.
              onChange={table.getToggleAllPageRowsSelectedHandler()}
            />
          )}
          {sortable && <SortMenu />}
        </div>
      )}
      {/* One element for every state, so it stays the same element (and
          keeps focus) as the state changes, e.g. from error to loading. */}
      {status && (
        <div
          {...stateFocus}
          ref={(node: HTMLDivElement | null) => {
            stateFocus.ref(node);
            contentRef.current = node;
          }}
          className={clsx(withBaseName.el('state'), withBaseName.el(status))}
          // The held height changes with the content shown before, so it
          // can't come from a class.
          style={heldHeight ? { minHeight: heldHeight } : undefined}
        >
          <DataViewStateContent
            status={status}
            error={error}
            onRetry={onRetry}
            loadingState={loadingState}
            errorState={errorState}
            emptyState={emptyState}
          />
        </div>
      )}
      {!status && (
        <ul
          ref={setListRef}
          className={withBaseName.el('list')}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
        >
          {rows.map((row) => {
            const value: RowContextValue<TData> = {
              row,
              selectable,
              cardActions,
              cardActionsPlacement,
              tabIndex: row.id === tabStopRowId ? 0 : -1,
              rowClickOptions,
            };
            return (
              <li
                key={row.id}
                className={clsx(withBaseName.el('item'), { [withBaseName.el('item') + '--clickable']: rowClickOptions })}
                // Mouse users can click anywhere on the card. The wrapper gets no
                // tabIndex, role, or key handler: the card contains checkboxes
                // and buttons, and making it interactive would nest interactive
                // elements. The keyboard and screen-reader equivalent is the
                // details control in the card header.
                onClick={rowClickOptions ? (e: React.MouseEvent<HTMLLIElement>) => activateRow(row, e, rowClickOptions) : undefined}
              >
                <RowContext.Provider value={value}>{children(row)}</RowContext.Provider>
              </li>
            );
          })}
        </ul>
      )}
      {showLoadingMore && <DataViewLoadingMore className={withBaseName.el('loading-more')} />}
      <VisuallyHidden role="status">{sortMessage}</VisuallyHidden>
    </div>
  );
}

CardView.displayName = 'CardView';
