import React from 'react';

export type DialogSize = 'sm' | 'md' | 'lg' | 'full';

export interface DialogProps extends Pick<React.HTMLAttributes<HTMLDivElement>, 'aria-label'> {
  /** Controls whether the dialog is visible. */
  open: boolean;
  /** Called when the dialog requests to close (Escape key or backdrop click). */
  onClose: () => void;
  /** Title rendered in the dialog header. Also used as aria-label. */
  title?: React.ReactNode;
  /** Content rendered inside the dialog body. */
  children: React.ReactNode;
  /** Controls the maximum width of the dialog panel. */
  size?: DialogSize;
  /** When true, clicking the backdrop does not close the dialog. */
  disableBackdropClose?: boolean;
  /** Additional className applied to the dialog panel. */
  className?: string;
}
