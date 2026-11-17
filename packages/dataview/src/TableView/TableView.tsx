import React from 'react';
import clsx from 'clsx';
import '../styles/variables.css';
import './TableView.css';
import '../styles/refreshing.css';
import type { TableViewProps } from './TableView.types';
import { flexRender } from '@tanstack/react-table';
import { Checkbox, Table, Tbody, Td, Th, Thead, Tr, VisuallyHidden } from '@aknishi/akds-reactkit';
import { useDataViewInstance, useRowLabel, activateRow, IGNORE_CLICK_ATTRIBUTE } from '../headless';
import { useSortAnnouncement } from '../headless/useSortAnnouncement';
import { DataViewActions } from '../DataViewActions';
import { DataViewDetailsSlot } from '../DataViewDetailsButton';
import { DataViewLoadingMore, DataViewStateContent, getDataViewStatus, useDataViewStateFocus, useHeldHeight } from '../DataViewState';
import { makePrefixer } from '../utils';
import {
  ACTIONS_PIN_KEY,
  SELECT_PIN_KEY,
  useHorizontalScrollEdges,
  usePinnedOffsets,
} from './pinning';
import type { PinSide } from './pinning';

const withBaseName = makePrefixer('akds-dataview-table');

/** Merges a cell's own class into its pin props. */
function withPin(pin: { className?: string }, className: string) {
  return { ...pin, className: clsx(className, pin.className) };
}

function SpacerRow({ height, columnCount }: { height: number; columnCount: number }) {
  return (
    <tr aria-hidden="true" className={withBaseName.el('spacer')}>
      {/* The height changes on every scroll, so it can't come from a class. */}
      <td colSpan={columnCount} style={{ height }} />
    </tr>
  );
}

export function TableView<TData>({
  selectable = false,
  loading = false,
  loadingMore = false,
  error,
  onRetry,
  loadingState,
  errorState,
  emptyState,
  rowActions,
  rowClickOptions,
  virtualizer,
  className,
  ...rest
}: TableViewProps<TData>) {
  const { table, state } = useDataViewInstance<TData>();
  const getRowLabel = useRowLabel<TData>();
  const sortMessage = useSortAnnouncement(table, state.sorting);
  const rows = table.getRowModel().rows;
  const columnCount = table.getVisibleLeafColumns().length + (selectable ? 1 : 0) + (rowActions ? 1 : 0);

  // Selection and actions are always pinned, outside any team-pinned columns.
  const tableRef = React.useRef<HTMLTableElement>(null);
  const leftKeys = [
    ...(selectable ? [SELECT_PIN_KEY] : []),
    ...table.getLeftLeafColumns().map((column) => column.id),
  ];
  const rightKeys = [
    ...table.getRightLeafColumns().map((column) => column.id),
    ...(rowActions ? [ACTIONS_PIN_KEY] : []),
  ];
  const offsets = usePinnedOffsets(tableRef, leftKeys, rightKeys);
  const status = getDataViewStatus(rows.length, { loading, loadingMore, error });
  // With rows shown, loading replaces them and loading more adds to them.
  // Loading wins: rows about to be replaced don't need a load-more indicator.
  const refreshing = loading && !status;
  const showLoadingMore = loadingMore && !loading && !status;
  // Once rows replace a state that had focus, the table takes it, so
  // keyboard users start from the new rows.
  const stateFocus = useDataViewStateFocus(status, () => tableRef.current?.focus());
  const scrollEdges = useHorizontalScrollEdges(tableRef);
  // A virtualized body is as tall as the whole list, and already sits in a
  // scroll area with a fixed height, so there's nothing to hold.
  const { contentRef: bodyRef, heldHeight } = useHeldHeight<HTMLTableSectionElement>(status, !virtualizer);

  // Pinned cells stick to their edge at the measured offset. The innermost
  // pinned cell on each side (the "edge") casts the shadow over scrolled content.
  const pinProps = (key: string) => {
    const side: PinSide | undefined = leftKeys.includes(key) ? 'left' : rightKeys.includes(key) ? 'right' : undefined;
    if (!side) return {};
    const isEdge = side === 'left' ? key === leftKeys[leftKeys.length - 1] : key === rightKeys[0];
    const pinned = withBaseName.el('pinned');
    return {
      'data-pin-key': key,
      className: clsx(pinned, `${pinned}--${side}`, { [`${pinned}--edge`]: isEdge }),
      style: { [side]: offsets[key] ?? 0 },
    };
  };

  // With a virtualizer only the visible rows are rendered; spacer rows above
  // and below keep the scroll height equal to the full list.
  const virtualItems = virtualizer?.getVirtualItems();
  const visibleRows = virtualItems
    ? virtualItems.flatMap((item) => {
      const row = rows[item.index];
      return row ? [{ row, index: item.index }] : [];
    })
    : rows.map((row, index) => ({ row, index }));
  const firstItem = virtualItems?.[0];
  const lastItem = virtualItems?.[virtualItems.length - 1];
  const paddingTop = firstItem ? firstItem.start : 0;
  const paddingBottom = virtualizer && lastItem ? virtualizer.getTotalSize() - lastItem.end : 0;
  const ignoreClick = { [IGNORE_CLICK_ATTRIBUTE]: '' };

  return (
    <>
      <Table
        ref={tableRef}
        className={clsx(
          withBaseName(),
          {
            [withBaseName('virtual')]: virtualizer,
            [withBaseName('refreshing')]: refreshing,
            [withBaseName('scrolled-start')]: scrollEdges.start,
            [withBaseName('scrolled-end')]: scrollEdges.end,
          },
          className,
        )}
        // Most rows aren't in the DOM, so tell assistive technology how many
        // there are and where each rendered row sits.
        aria-rowcount={virtualizer ? rows.length + 1 : undefined}
        aria-busy={loading || loadingMore || undefined}
        // Focusable from script only, for useDataViewStateFocus.
        tabIndex={-1}
        {...rest}
      >
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id} aria-rowindex={virtualizer ? 1 : undefined}>
              {selectable && (
                <Th scope="col" {...withPin(pinProps(SELECT_PIN_KEY), withBaseName.el('select-cell'))}>
                  <Checkbox
                    label={<VisuallyHidden>Select all shown rows</VisuallyHidden>}
                    checked={table.getIsAllPageRowsSelected()}
                    indeterminate={table.getIsSomePageRowsSelected()}
                    // "Page rows" are the rows currently shown, so select all
                    // never selects rows hidden by a search.
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                  />
                </Th>
              )}
              {headerGroup.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                return (
                  <Th
                    key={header.id}
                    scope="col"
                    {...pinProps(header.column.id)}
                    sortable={header.column.getCanSort()}
                    sortDirection={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
                    onSort={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                );
              })}
              {rowActions && (
                <Th scope="col" {...pinProps(ACTIONS_PIN_KEY)}>
                  <VisuallyHidden>Actions</VisuallyHidden>
                </Th>
              )}
            </Tr>
          ))}
        </Thead>
        <Tbody ref={bodyRef}>
          {paddingTop > 0 && <SpacerRow height={paddingTop} columnCount={columnCount} />}
          {visibleRows.map(({ row, index }) => (
            <Tr
              key={row.id}
              ref={virtualizer?.measureElement}
              data-index={virtualizer ? index : undefined}
              aria-rowindex={virtualizer ? index + 2 : undefined}
              className={clsx(
                withBaseName.el('row'),
                {
                  [withBaseName.el('row') + '--selected']: row.getIsSelected(),
                  [withBaseName.el('row') + '--clickable']: rowClickOptions,
                },
              )}
              // Mouse users can click anywhere on the row. The row itself
              // gets no tabIndex, role, or key handler: it contains
              // checkboxes and buttons, and making it interactive would nest
              // interactive elements. The keyboard and screen-reader
              // equivalent is the details control in the first data cell.
              onClick={rowClickOptions ? (e: React.MouseEvent<HTMLTableRowElement>) => activateRow(row, e, rowClickOptions) : undefined}
            >
              {selectable && (
                <Td {...withPin(pinProps(SELECT_PIN_KEY), withBaseName.el('select-cell'))} {...ignoreClick}>
                  <Checkbox
                    label={<VisuallyHidden>Select {getRowLabel(row)}</VisuallyHidden>}
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                  />
                </Td>
              )}
              {row.getVisibleCells().map((cell, cellIndex) => {
                const rendered = flexRender(cell.column.columnDef.cell, cell.getContext());
                // The details control follows the first data cell's content.
                const content = rowClickOptions && cellIndex === 0 ? (
                  <div className={withBaseName.el('details-cell')}>
                    {rendered}
                    <DataViewDetailsSlot row={row} rowLabel={getRowLabel(row)} options={rowClickOptions} />
                  </div>
                ) : rendered;
                // Row header cells let screen readers announce which row
                // (e.g. which customer) a cell belongs to.
                const pin = pinProps(cell.column.id);
                return cell.column.columnDef.meta?.rowHeader ? (
                  <Th key={cell.id} scope="row" {...withPin(pin, withBaseName.el('row-header'))}>
                    {content}
                  </Th>
                ) : (
                  <Td key={cell.id} {...pin}>{content}</Td>
                );
              })}
              {rowActions && (
                <Td {...withPin(pinProps(ACTIONS_PIN_KEY), withBaseName.el('actions-cell'))} {...ignoreClick}>
                  <DataViewActions>{rowActions(row)}</DataViewActions>
                </Td>
              )}
            </Tr>
          ))}
          {paddingBottom > 0 && <SpacerRow height={paddingBottom} columnCount={columnCount} />}
          {showLoadingMore && (
            <Tr>
              <Td colSpan={columnCount} className={withBaseName.el('loading-more')}>
                <DataViewLoadingMore />
              </Td>
            </Tr>
          )}
          {/* One cell for every state, so it stays the same element (and
              keeps focus) as the state changes, e.g. from error to loading. */}
          {status && (
            // The held height changes with the content shown before, so it
            // can't come from a class; the CSS takes the taller of it and
            // the state minimum.
            <Tr
              className={withBaseName.el('status-row')}
              style={heldHeight ? { '--akds-dataview-held-height': `${heldHeight}px` } as React.CSSProperties : undefined}
            >
              <Td
                colSpan={columnCount}
                className={clsx(withBaseName.el('state'), withBaseName.el(status))}
                {...stateFocus}
              >
                <DataViewStateContent
                  status={status}
                  error={error}
                  onRetry={onRetry}
                  loadingState={loadingState}
                  errorState={errorState}
                  emptyState={emptyState}
                />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <VisuallyHidden role="status">{sortMessage}</VisuallyHidden>
    </>
  );
}

TableView.displayName = 'TableView';
