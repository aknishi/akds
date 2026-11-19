import React from 'react';

export interface OptionContextValue {
  variant: 'menu' | 'listbox';
  isSelected: (value: string) => boolean;
  onSelect: (value: string) => void;
  multiple: boolean;
  parentDisabled: boolean;
  /**
   * Listbox only: whether this option is the listbox's single Tab stop
   * (roving tabindex). Options without it get tabIndex -1 and are reached
   * with the arrow keys; when omitted, the selected option is the Tab stop.
   */
  isTabStop?: (value: string) => boolean;
  /** Listbox only: called when an option receives focus. */
  onOptionFocus?: (value: string) => void;
}

export const OptionContext = React.createContext<OptionContextValue>({
  variant: 'menu',
  isSelected: () => false,
  onSelect: () => {},
  multiple: false,
  parentDisabled: false,
});
