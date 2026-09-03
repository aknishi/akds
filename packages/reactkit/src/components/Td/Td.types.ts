import React from 'react';

export type TdAlign = 'left' | 'center' | 'right';

export interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Horizontal text alignment of the cell content. */
  align?: TdAlign;
  /** The cell content. */
  children?: React.ReactNode;
}
