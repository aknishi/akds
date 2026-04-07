import React from 'react';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface DrawerProps {
  /** Controls whether the drawer is visible. */
  open: boolean;
  /** Called when the drawer requests to close (Escape key or backdrop click). */
  onClose: () => void;
  /** The side from which the drawer slides in. */
  side?: DrawerSide;
  /** Title rendered in the drawer header. Also used as aria-label. */
  title?: React.ReactNode;
  /** Content rendered inside the drawer body. */
  children: React.ReactNode;
  /** Controls the width (for left/right) or height (for top/bottom) of the drawer panel. */
  size?: DrawerSize;
  /** When true, clicking the backdrop does not close the drawer. */
  disableBackdropClose?: boolean;
  /** Additional className applied to the drawer panel. */
  className?: string;
}
