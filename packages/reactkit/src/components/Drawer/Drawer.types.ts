import React from 'react';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface DrawerProps extends Pick<React.HTMLAttributes<HTMLDialogElement>, 'aria-label'> {
  /** Controls whether the drawer is visible. */
  open: boolean;
  /**
   * Called when the user asks to close: swiping the drawer off-screen, Escape /
   * back gesture, tapping the backdrop, or the close button. The drawer only
   * slides out once `open` becomes false; if it stays true after a swipe, the
   * drawer snaps back open.
   */
  onClose: () => void;
  /** The side from which the drawer slides in. */
  side?: DrawerSide;
  /**
   * Title rendered in the drawer header; also names the drawer for assistive
   * tech. Without a title, pass `aria-label` so the drawer has a name.
   */
  title?: React.ReactNode;
  /** Content rendered inside the drawer body. */
  children: React.ReactNode;
  /** Controls the width (for left/right) or height (for top/bottom) of the drawer panel. */
  size?: DrawerSize;
  /**
   * When true, tapping the backdrop does not close the drawer. Swiping it away,
   * Escape and the close button still request close.
   */
  disableBackdropClose?: boolean;
  /**
   * Additional className applied to the root `<dialog>`, which fills the
   * viewport. Target `.akds-drawer__sheet` within it to style the visible panel.
   */
  className?: string;
}
