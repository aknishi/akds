import React from 'react';
import clsx from 'clsx';
import './SortMenu.css';
import { ActionsMenu, Button, IconButton, MenuItem, Tooltip, VisuallyHidden } from '@aknishi/akds-reactkit';
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, KeyboardArrowDownIcon } from '@aknishi/akds-icons';
import { getColumnLabel, useDataViewInstance } from '../headless';
import { makePrefixer } from '../utils';

const withBaseName = makePrefixer('akds-dataview-sort');

export interface SortMenuProps {
  className?: string;
}

/**
 * Sorting for views without column headers: a menu of the sortable columns
 * and a button that reverses the direction. It reads and writes the same
 * sorting state as TableView's headers. Internal — not exported.
 */
export function SortMenu<TData>({ className }: SortMenuProps) {
  const { table, state } = useDataViewInstance<TData>();
  const columns = table.getAllLeafColumns().filter((column) => column.getCanSort());
  const [current] = state.sorting;
  const sortedColumn = current ? table.getColumn(current.id) : undefined;
  const desc = current?.desc ?? false;
  // Same icons as Th, so the direction reads the same in both views.
  const DirectionIcon = desc ? ArrowDownIcon : ArrowUpIcon;
  const labelFor = (column?: typeof sortedColumn) => (column ? `Sort by: ${getColumnLabel(column)}` : 'Sort by');
  const currentLabel = labelFor(sortedColumn);

  // MenuItem has no checked state (and Menu only navigates role="menuitem"),
  // so the current choice is marked with aria-current and a check icon.
  const currentProps = (isCurrent: boolean) => ({
    'aria-current': isCurrent || undefined,
    trailingElement: isCurrent ? <CheckIcon size="sm" /> : undefined,
  });

  return (
    <div className={clsx(withBaseName(), className)}>
      <ActionsMenu
        trigger={(
          <Button size="sm" appearance="bordered">
            {/* Every possible label is stacked in one grid cell, so the
                button is always as wide as the longest and doesn't resize
                when the sort changes. Only the current one is visible or
                part of the button's name. */}
            <span className={withBaseName.el('label')}>
              <span>
                {currentLabel}
                {/* The direction is otherwise only shown by the icon next to it. */}
                {sortedColumn && <VisuallyHidden>, {desc ? 'descending' : 'ascending'}</VisuallyHidden>}
              </span>
              {[labelFor(), ...columns.map(labelFor)].map((label, index) => (
                <span key={index} className={withBaseName.el('sizer')} aria-hidden="true">
                  {label}
                </span>
              ))}
            </span>
            <KeyboardArrowDownIcon size="sm" aria-hidden="true" />
          </Button>
        )}
      >
        <MenuItem {...currentProps(!sortedColumn)} onClick={() => table.resetSorting(true)}>
          Default order
        </MenuItem>
        {columns.map((column) => {
          const isCurrent = column.id === sortedColumn?.id;
          return (
            <MenuItem
              key={column.id}
              {...currentProps(isCurrent)}
              // Starts ascending, like the first click on a table header.
              onClick={() => { if (!isCurrent) column.toggleSorting(false); }}
            >
              {getColumnLabel(column)}
            </MenuItem>
          );
        })}
      </ActionsMenu>
      {/* A stable name rather than one that flips with the direction, so
          voice control users can always say the same thing. */}
      <Tooltip content="Reverse sort order">
        <IconButton
          appearance="bordered"
          aria-label="Reverse sort order"
          disabled={!sortedColumn}
          onClick={() => sortedColumn?.toggleSorting(!desc)}
        >
          <DirectionIcon aria-hidden="true" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
