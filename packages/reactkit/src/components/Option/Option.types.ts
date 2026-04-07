import React from 'react';

export interface OptionProps extends React.HTMLAttributes<HTMLElement> {
  /** The value this option represents. Optional for plain action menu items. */
  value?: string;
  /** When true, prevents interaction and applies disabled styling. */
  disabled?: boolean;
  /**
   * Element rendered after the label, pinned to the right (shortcut hint, badge, etc.).
   * Only shown in menu context — ignored in listbox context.
   */
  trailingElement?: React.ReactNode;
  /** Label content. Use a plain string so DropdownMenu can extract display text. */
  children: React.ReactNode;
}
