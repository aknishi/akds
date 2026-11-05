import type React from 'react';
import type { Row } from '@tanstack/react-table';
import type { CardActionsPlacement } from '../headless';
import type { DataViewStateProps } from '../DataViewState';
import type { RowClickOptions } from '../headless/rowClickOptions';

export interface CardViewProps<TData> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, DataViewStateProps {
  /**
   * Names the list of cards, e.g. "Orders". Applied to the list rather than
   * the outer container. Overrides the inherited attribute's target.
   */
  'aria-label'?: string;
  /** Points to an element that names the list of cards. Applied to the list rather than the outer container. */
  'aria-labelledby'?: string;
  /**
   * Adds a checkbox to each card's header for selecting its row, and a
   * "select all shown rows" checkbox to the view's header bar.
   */
  selectable?: boolean;
  /**
   * Renders actions for a card. Return any content — an ActionsMenu, a
   * button, or several buttons. Give each action an accessible name that
   * includes the row, e.g. "Actions for Hanako Sato".
   */
  cardActions?: (row: Row<TData>) => React.ReactNode;
  /**
   * Where card actions render: in the header next to the title (for compact
   * actions like an ActionsMenu), or in a footer (for text buttons).
   */
  cardActionsPlacement?: CardActionsPlacement;
  /**
   * Opens a card's details, e.g. in a Drawer. Clicking anywhere on the card
   * calls `onClick` (except checkboxes, actions, other interactive elements,
   * and elements with `data-dataview-ignore-click`), and each card gets a
   * details button for keyboard, screen reader, and touch users.
   * `renderButton` replaces that button, e.g. with a "Details" text button.
   */
  rowClickOptions?: RowClickOptions<TData>;
  /**
   * Renders the card for a row, typically a DataViewCard. A render function
   * rather than a component type, so cards aren't remounted on every render.
   * Required — overrides the inherited type.
   */
  children: (row: Row<TData>) => React.ReactNode;
}
