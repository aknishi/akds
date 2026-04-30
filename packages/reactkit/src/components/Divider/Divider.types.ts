import React from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  /** The orientation of the divider. */
  orientation?: DividerOrientation;
  /** The line style of the divider. */
  variant?: DividerVariant;
  /** When provided, renders a text label centred on the divider. */
  label?: React.ReactNode;
}
