import React from 'react';

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Content announced by screen readers but not shown on screen. Required — overrides the optional inherited type. */
  children: React.ReactNode;
}
