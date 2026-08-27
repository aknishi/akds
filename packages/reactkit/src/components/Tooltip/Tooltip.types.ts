import React from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** The tooltip text or content displayed on hover/focus. */
  content: React.ReactNode;
  /** The interactive element that triggers the tooltip. Must be a single React element. */
  children: React.ReactElement;
  /** Controls which side of the trigger the tooltip appears on. Defaults to 'top'. */
  placement?: TooltipPlacement;
  /** Controlled visibility. When provided, hover/focus/blur no longer toggle the tooltip directly — pair with onOpenChange. */
  open?: boolean;
  /** Called when hover/focus/blur on the trigger would change visibility. Required to react to those events when open is controlled. */
  onOpenChange?: (open: boolean) => void;
}
