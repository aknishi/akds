import type React from 'react';

/**
 * Where a row's details open, which sets the button's default icon,
 * accessible name, and tooltip:
 * - `"drawer"`: a side panel on the same page, e.g. a Drawer.
 * - `"page"`: another page in the same tab.
 * - `"new-tab"`: another page in a new tab or window.
 */
export type DataViewDetailsTarget = 'drawer' | 'page' | 'new-tab';

export interface DataViewDetailsButtonProps {
  /** The row's plain-text name, from the `renderButton` context. Required. */
  rowLabel: string;
  /** Opens the row's details. Pass the `renderButton` context's `onClick`. Required. */
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  /** Where the details open. Sets the default icon, accessible name, and tooltip to match. */
  target?: DataViewDetailsTarget;
  /** Replaces the target's icon, e.g. `<LeftPanelOpenIcon />` for a Drawer on the left. */
  icon?: React.ReactNode;
  /**
   * Replaces the target's accessible name, given the row's label, e.g.
   * `(rowLabel) => \`Preview ${rowLabel}\``. Include the label so every
   * row's button has a unique name.
   */
  label?: ((rowLabel: string) => string) | undefined;
  /** Replaces the target's tooltip. Start it with the same words as the accessible name, so voice control users know what to say. */
  tooltip?: string | undefined;
  className?: string;
}
