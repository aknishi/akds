import React from 'react';

export interface RadioGroupContextValue {
  /** Shared name for all child Radio inputs. */
  name: string;
  /** Currently selected value. */
  value?: string | number;
  /** Change handler called when an option is selected. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** When true, all child Radios are disabled. */
  disabled: boolean;
}

export const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);
