import React from 'react';
import type { ToggleButtonSize } from './ToggleButton.types';

export interface ToggleButtonContextValue {
  /** The currently selected value within the group. */
  value: string | undefined;
  /** Called with a button's value when it is selected. */
  onChange: (value: string) => void;
  /** When true, all child ToggleButtons are disabled. */
  disabled: boolean;
  /** Size applied to all child ToggleButtons. */
  size: ToggleButtonSize;
}

export const ToggleButtonContext = React.createContext<ToggleButtonContextValue | null>(null);
