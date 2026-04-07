import React from 'react';

export type MenuPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

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
  /**
   * Ref to the element the menu anchors to. When provided the menu renders in
   * a portal with fixed positioning instead of inline.
   */
  triggerRef?: React.RefObject<HTMLElement>;
  /**
   * Preferred placement relative to the trigger. Defaults to 'bottom-left'.
   * Automatically flips to the opposite vertical side when there is not enough
   * space.
   */
  placement?: MenuPlacement;
}
