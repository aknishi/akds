import React from 'react';

export interface OptionContextValue {
  variant: 'menu' | 'listbox';
  isSelected: (value: string) => boolean;
  onSelect: (value: string) => void;
  multiple: boolean;
  parentDisabled: boolean;
}

export const OptionContext = React.createContext<OptionContextValue>({
  variant: 'menu',
  isSelected: () => false,
  onSelect: () => {},
  multiple: false,
  parentDisabled: false,
});
