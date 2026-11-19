import React from 'react';
import type { MenuPlacement } from '../Menu/Menu.types';

interface ActionsMenuBaseProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  /** MenuItem children. Required — overrides the optional inherited type. */
  children: React.ReactNode;
  /** Preferred placement of the menu relative to the trigger. */
  placement?: MenuPlacement;
  /** When true, the trigger cannot open the menu and renders with disabled styling. */
  disabled?: boolean;
  /** Keeps the trigger focusable when disabled, so screen-reader users can still find it. */
  focusableWhenDisabled?: boolean;
  /** Called whenever the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

interface ActionsMenuWithDefaultTriggerProps extends ActionsMenuBaseProps {
  /** Omit to use the default trigger: an icon button with a vertical ellipsis. */
  trigger?: undefined;
  /**
   * Accessible name for the default icon trigger. Required, and should be
   * specific, e.g. "Actions for Hanako Sato" — many triggers all named
   * "More actions" are indistinguishable to a screen-reader user.
   */
  label: string;
}

interface ActionsMenuWithCustomTriggerProps extends ActionsMenuBaseProps {
  /**
   * A `Button` or `IconButton` element to open the menu with, e.g. a labelled
   * button with a chevron. ActionsMenu adds the ref, click handling,
   * `aria-haspopup`, and disabled state to it.
   */
  trigger: React.ReactElement;
  /**
   * Optional accessible name. Usually leave it out: the trigger's visible
   * text is its name. Required for an icon-only `IconButton` trigger.
   */
  label?: string;
}

// A union, so `label` is only optional when a custom trigger is passed.
export type ActionsMenuProps = ActionsMenuWithDefaultTriggerProps | ActionsMenuWithCustomTriggerProps;
