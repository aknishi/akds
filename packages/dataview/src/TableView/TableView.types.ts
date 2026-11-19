import type React from 'react';
import type { Row } from '@tanstack/react-table';
import type { TableProps } from '@aknishi/akds-reactkit';
import type { DataViewStateProps } from '../DataViewState';
import type { RowClickOptions } from '../headless/rowClickOptions';

/** The parts of a virtual item DataView reads. Matches @tanstack/react-virtual's VirtualItem. */
export interface DataViewVirtualItem {
  key: React.Key;
  index: number;
  start: number;
  end: number;
}

/**
 * The parts of a virtualizer DataView reads. Declared here rather than
 * imported, so @tanstack/react-virtual is never bundled with DataView: teams
 * that need virtualization install it and pass `useVirtualizer(...)` in.
 */
export interface DataViewVirtualizer {
  getVirtualItems: () => DataViewVirtualItem[];
  getTotalSize: () => number;
  measureElement?: (element: Element | null) => void;
}

export interface TableViewProps<TData> extends Omit<TableProps, 'children'>, DataViewStateProps {
  /**
   * Names the table, rendered as its `<caption>`. It also names the scroll
   * region around the table, which keyboard users tab to when the table is
   * wider than its space. Wrap it in VisuallyHidden to name the table
   * without showing the caption. Without a caption, pass `aria-label` or
   * `aria-labelledby` instead; both views use it.
   */
  caption?: React.ReactNode;
  /** Adds a first column of checkboxes for selecting rows, with a "select all" checkbox in the header. */
  selectable?: boolean;
  /**
   * Renders actions for a row in a last column. Return any content — an
   * ActionsMenu, a button, or several buttons. Give each action an accessible
   * name that includes the row, e.g. "Actions for Hanako Sato".
   */
  rowActions?: (row: Row<TData>) => React.ReactNode;
  /**
   * Opens a row's details, e.g. in a Drawer. Clicking anywhere on the row
   * calls `onClick` (except checkboxes, actions, other interactive elements,
   * and elements with `data-dataview-ignore-click`), and each row gets a
   * details button for keyboard, screen reader, and touch users.
   * `renderButton` replaces that button, e.g. with a "Details" text button.
   */
  rowClickOptions?: RowClickOptions<TData>;
  /**
   * Renders only the rows the virtualizer reports as visible. Create it with
   * `useVirtualizer` from @tanstack/react-virtual, with `count` set to the
   * number of rows and `getScrollElement` returning a DataViewScrollArea
   * rendered around the table.
   */
  virtualizer?: DataViewVirtualizer;
}
