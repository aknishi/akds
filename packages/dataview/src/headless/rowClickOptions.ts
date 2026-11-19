import type React from 'react';
import type { Row } from '@tanstack/react-table';
import { shouldIgnoreRowClick } from './rowClick';
import type { RowClickHandler } from './context';

/** What `renderButton` receives to build a row's or card's details control. */
export interface RowClickButtonContext<TData> {
  /** The row the control belongs to. */
  row: Row<TData>;
  /**
   * The row's plain-text name, from useDataView's `getRowLabel`. Use it in
   * the control's accessible name, e.g. `Details for ${rowLabel}`, so every
   * row's control has a unique name.
   */
  rowLabel: string;
  /** Opens the row's details: calls `rowClickOptions.onClick` for this row. Pass it to your control's `onClick`. */
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Opens a row's or card's details, e.g. in a Drawer. Clicking anywhere on
 * the row or card calls `onClick` (except checkboxes, actions, and other
 * interactive elements), and each row or card gets a details button for
 * keyboard, screen reader, and touch users.
 */
export interface RowClickOptions<TData> {
  /** Called when the row or card is clicked, or its details button is activated. */
  onClick: RowClickHandler<TData>;
  /**
   * Renders a custom details control instead of the default icon button,
   * e.g. a "Details" text button. Call it with the context's `onClick`, and
   * give it an accessible name that includes `rowLabel`. Use
   * DataViewDetailsButton to keep the standard icon button with a different
   * target, icon, name, or tooltip.
   */
  renderButton?: ((context: RowClickButtonContext<TData>) => React.ReactNode) | undefined;
  /**
   * Fades the details button in only while the row or card is hovered or has
   * focus within, on devices that can hover. Set to false to always show it,
   * e.g. for a text button. Defaults to true.
   */
  revealButtonOnHover?: boolean | undefined;
  // Planned: getHref?: (row: Row<TData>) => string — makes the details
  // button a link and has row clicks follow it. Not part of the API yet; see
  // the commented-out navigation in activateRow below.
}

/**
 * Handles a click on a row or card: ignores clicks on its controls, then
 * calls the click handler.
 */
export function activateRow<TData>(
  row: Row<TData>,
  event: React.MouseEvent<HTMLElement>,
  options: RowClickOptions<TData>,
) {
  if (shouldIgnoreRowClick(event)) return;
  options.onClick(row, event);
  // Planned getHref support: follow the row's URL unless the handler called
  // event.preventDefault(), opening a new tab on a ⌘/Ctrl-click.
  // const href = options.getHref?.(row);
  // if (!href || event.defaultPrevented) return;
  // if (event.metaKey || event.ctrlKey) {
  //   window.open(href, '_blank', 'noopener,noreferrer');
  // } else {
  //   window.location.assign(href);
  // }
}
