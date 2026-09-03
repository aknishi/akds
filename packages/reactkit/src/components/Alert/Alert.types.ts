import React from 'react';

export type AlertEmphasis = 'info' | 'success' | 'warning' | 'error';
export type AlertVariant = 'default' | 'filled';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Conveys the severity of the message. Determines the status icon and status color. */
  emphasis?: AlertEmphasis;
  /** Controls the visual style of the alert. `default` uses a tinted background with status-colored text; `filled` uses a solid status-colored background with contrasting text. */
  variant?: AlertVariant;
  /**
   * Custom icon rendered before the content, overriding the default icon for
   * the current `emphasis`. Pass `false` to hide the icon entirely.
   */
  icon?: React.ReactNode;
  /** Content rendered at the end of the alert, such as a dismiss `IconButton` or a `DropdownMenu` trigger. */
  action?: React.ReactNode;
  /** Content rendered inside the alert. Compose with `AlertTitle` and body text. */
  children: React.ReactNode;
}
