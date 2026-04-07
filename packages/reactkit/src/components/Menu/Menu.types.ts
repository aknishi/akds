import React from 'react';

export interface MenuProps extends React.HTMLAttributes<HTMLUListElement> {
  /**
   * When true, the menu panel is visible. Always controlled — the consumer
   * manages open state and passes it in.
   */
  open?: boolean;
  /**
   * Called when the menu requests a change in open state (e.g. Escape key,
   * focus leaving the menu). The consumer decides whether to honour the change.
   */
  onOpenChange?: (open: boolean) => void;
  /** Option (or MenuItem) elements. */
  children: React.ReactNode;
}
