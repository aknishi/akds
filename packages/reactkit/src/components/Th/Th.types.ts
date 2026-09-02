import React from 'react';

export type ThAlign = 'left' | 'center' | 'right';

export interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Horizontal text alignment of the cell content. */
  align?: ThAlign;
  /** When true, renders a draggable handle on the trailing edge that resizes this column (drag, or arrow keys when the handle is focused). */
  resizable?: boolean;
  /** The current column width in pixels. Passing this makes the width controlled — pair with onWidthChange. */
  width?: number;
  /** Initial column width in pixels for the uncontrolled case. Ignored when width is provided. */
  defaultWidth?: number;
  /** Called with the new width in pixels whenever the column is resized, in both the controlled and uncontrolled cases. */
  onWidthChange?: (width: number) => void;
  /** The cell content. */
  children?: React.ReactNode;
}
