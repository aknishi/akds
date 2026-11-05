import type React from 'react';

export type BulkActionsVariant = 'button' | 'icon-button' | 'menu' | 'icon-menu';

export interface BulkAction<TData> {
  /** The action's text, e.g. "Export". Also its accessible name. */
  label: string;
  /** Icon shown before the label (`"button"`) or on its own (`"icon-button"`). Required for `"icon-button"`. */
  icon?: React.ReactNode;
  /** Called with the original data of every selected row. */
  onSelect: (rows: TData[]) => void;
}

interface BulkActionsBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {}

interface BulkActionsWithLabelsProps<TData> extends BulkActionsBaseProps {
  /**
   * How the actions are shown. `"button"`: bordered buttons side by side.
   * `"icon-button"`: icon-only buttons. `"menu"`: a "Bulk actions" button
   * that opens a menu of the actions. `"icon-menu"`: the same menu from a
   * more-actions (vertical ellipsis) icon button, for the tightest spaces.
   * Switch it per breakpoint as needed.
   */
  variant?: 'button' | 'menu' | 'icon-menu';
  /** Actions that apply to all selected rows. */
  actions: BulkAction<TData>[];
}

interface BulkActionsIconOnlyProps<TData> extends BulkActionsBaseProps {
  /** Icon-only buttons, each named by its action's label. */
  variant: 'icon-button';
  /** Actions that apply to all selected rows. Each needs an `icon` in this variant. */
  actions: (BulkAction<TData> & { icon: React.ReactNode })[];
}

// A union, so `variant="icon-button"` only compiles when every action has an icon.
export type BulkActionsProps<TData> = BulkActionsWithLabelsProps<TData> | BulkActionsIconOnlyProps<TData>;
