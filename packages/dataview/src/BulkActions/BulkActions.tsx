import React from 'react';
import clsx from 'clsx';
import '../styles/variables.css';
import './BulkActions.css';
import type { BulkActionsProps } from './BulkActions.types';
import { ActionsMenu, Button, IconButton, MenuItem, VisuallyHidden } from '@aknishi/akds-reactkit';
import { KeyboardArrowDownIcon } from '@aknishi/akds-icons';
import { useDataViewInstance, getSelectedOriginals, getSelectedRowIds } from '../headless';
import { useAnnounce } from '../headless/announcer';
import { makePrefixer } from '../utils';

const withBaseName = makePrefixer('akds-dataview-bulk-actions');

const ANNOUNCE_DELAY_MS = 300;

const rowsLabel = (count: number) => `${count} ${count === 1 ? 'row' : 'rows'}`;

/**
 * Selecting several rows quickly would queue one announcement per click, so
 * the announcement waits until selection pauses and is made once.
 */
function useSelectionAnnouncement(selectedCount: number) {
  const announce = useAnnounce();
  const prevCountRef = React.useRef(selectedCount);

  React.useEffect(() => {
    if (prevCountRef.current === selectedCount) return undefined;
    prevCountRef.current = selectedCount;
    const timer = setTimeout(() => {
      announce(
        selectedCount > 0
          ? `${rowsLabel(selectedCount)} selected. Bulk actions available above table.`
          : 'Selection cleared.',
      );
    }, ANNOUNCE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [selectedCount]);
}

export function BulkActions<TData>({ variant = 'button', actions, className, ...rest }: BulkActionsProps<TData>) {
  const { table } = useDataViewInstance<TData>();
  // Server-side, `data` is only the current page: rows selected on other
  // pages count too, and the total comes from the server's rowCount.
  const serverSide = table.options.manualPagination === true;
  const selectedCount = serverSide ? getSelectedRowIds(table).length : table.getSelectedRowModel().rows.length;
  // Every row in the data, including rows hidden by search or filters.
  // Server-side, only the rows matching the current search and filters.
  const totalCount = serverSide ? table.getRowCount() : table.getCoreRowModel().rows.length;
  const hasSelection = selectedCount > 0;
  // TanStack's getIsAllRowsSelected only looks at rows that pass the filters.
  const allSelected = totalCount > 0 && selectedCount === totalCount;
  // Server-side there's no Select all: the rows on other pages aren't
  // loaded, so bulk actions couldn't be given their data.
  const canSelectAll = !serverSide && !allSelected;
  useSelectionAnnouncement(selectedCount);
  const selectAllRef = React.useRef<HTMLButtonElement>(null);
  const clearRef = React.useRef<HTMLButtonElement>(null);
  const summaryRef = React.useRef<HTMLSpanElement>(null);
  const focusAfterRenderRef = React.useRef<React.RefObject<HTMLElement> | null>(null);

  // Select all and Clear selection each hide themselves when clicked, and
  // the other one only appears after the next render, so focus moves to it
  // once that render is done.
  React.useEffect(() => {
    const target = focusAfterRenderRef.current;
    if (!target) return;
    focusAfterRenderRef.current = null;
    target.current?.focus();
  });

  // Unlike the header checkbox, which selects only the rows currently shown,
  // this selects every row, including rows hidden by search or filters.
  // TanStack's toggleAllRowsSelected also only covers filtered rows, so the
  // selection is built from the core row model (every row) directly.
  const handleSelectAll = () => {
    table.setRowSelection(
      Object.fromEntries(table.getCoreRowModel().rows.map((row) => [row.id, true])),
    );
    focusAfterRenderRef.current = clearRef;
  };

  const handleClear = () => {
    table.resetRowSelection();
    // Clear selection hides itself; without Select all to take focus, the
    // summary ("243 rows") does, so focus isn't dropped to the page.
    focusAfterRenderRef.current = serverSide ? summaryRef : selectAllRef;
  };

  const runAction = (onSelect: (rows: TData[]) => void) => () => onSelect(getSelectedOriginals(table));

  const menuItems = actions.map((action) => (
    <MenuItem key={action.label} onClick={runAction(action.onSelect)}>
      {action.label}
    </MenuItem>
  ));

  // The toolbar keeps the same height whatever is selected, so selecting a
  // row never shifts the table below it.
  return (
    <div className={clsx(withBaseName(), withBaseName(variant), className)} {...rest}>
      <span
        ref={summaryRef}
        className={withBaseName.el('summary')}
        // Focusable from script only, server-side, for Clear selection.
        tabIndex={serverSide ? -1 : undefined}
      >
        {/* Server-side, selected rows can include rows outside the current
            search, so "5 of 3 selected" is possible; the total is left out. */}
        {hasSelection
          ? serverSide ? `${selectedCount} selected` : `${selectedCount} of ${totalCount} selected`
          : rowsLabel(totalCount)}
      </span>
      {/* Removed rather than hidden once everything is selected, so it
          doesn't leave a gap before Clear selection. */}
      {canSelectAll && (
        <Button
          ref={selectAllRef}
          size="sm"
          appearance="bordered"
          className={withBaseName.el('select-all')}
          onClick={handleSelectAll}
        >
          {/* "Select all 40 rows", so it can't be confused with the header
              checkbox, which selects only the rows shown. */}
          Select all<VisuallyHidden> {rowsLabel(totalCount)}</VisuallyHidden>
        </Button>
      )}
      <Button
        ref={clearRef}
        size="sm"
        appearance="bordered"
        className={clsx(withBaseName.el('clear'), { [withBaseName.el('clear') + '--hidden']: !hasSelection })}
        onClick={handleClear}
      >
        Clear selection
      </Button>
      <div
        className={clsx(
          withBaseName.el('actions'),
          // Actions appear only once there's a selection to act on. Hidden
          // rather than removed, so they keep their space and the toolbar
          // doesn't change size.
          { [withBaseName.el('actions') + '--hidden']: !hasSelection },
        )}
      >
        {variant === 'menu' && (
          <ActionsMenu
            // A labelled button rather than the default ellipsis, so it's
            // clear what it's for; the chevron shows it opens a menu.
            trigger={(
              <Button size="sm" appearance="bordered">
                Bulk actions
                <KeyboardArrowDownIcon size="sm" aria-hidden="true" />
              </Button>
            )}
          >
            {menuItems}
          </ActionsMenu>
        )}
        {variant === 'icon-menu' && (
          // The default more-actions icon trigger, named for screen readers.
          <ActionsMenu label="Bulk actions">
            {menuItems}
          </ActionsMenu>
        )}
        {variant === 'button' && actions.map((action) => (
          <Button key={action.label} size="sm" appearance="bordered" onClick={runAction(action.onSelect)}>
            {action.icon}
            {action.label}
          </Button>
        ))}
        {variant === 'icon-button' && actions.map((action) => (
          <IconButton
            key={action.label}
            appearance="transparent"
            // Says what it acts on, since the icon has no visible text.
            aria-label={`${action.label} ${selectedCount} selected ${selectedCount === 1 ? 'row' : 'rows'}`}
            onClick={runAction(action.onSelect)}
          >
            {action.icon}
          </IconButton>
        ))}
      </div>
    </div>
  );
}

BulkActions.displayName = 'BulkActions';
