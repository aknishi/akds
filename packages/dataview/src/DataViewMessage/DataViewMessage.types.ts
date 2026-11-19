import type React from 'react';

export interface DataViewMessageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** A decorative icon above the title, e.g. a Spinner or ErrorIcon. Hidden from screen readers. */
  icon?: React.ReactNode;
  /** The main message, e.g. "No orders yet". Required. Overrides the inherited HTML `title` attribute. */
  title: React.ReactNode;
  /** Supporting text below the title, e.g. what to do next. */
  description?: React.ReactNode;
  /** An action below the text, e.g. a "Try again" or "Create order" button. */
  action?: React.ReactNode;
}
