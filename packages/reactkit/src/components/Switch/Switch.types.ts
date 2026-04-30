import React from 'react';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'onChange'> {
  /** The label text rendered next to the switch. */
  label?: React.ReactNode;
  /** The checked state (controlled). */
  checked?: boolean;
  /** The default checked state (uncontrolled). */
  defaultChecked?: boolean;
  /** Change handler forwarded to the inner <input>. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Name attribute forwarded to the inner <input>. */
  name?: string;
  /** Value attribute forwarded to the inner <input>. */
  value?: string;
  /** When true, prevents interaction and applies disabled styling. */
  disabled?: boolean;
  /** Sets the size of the switch. */
  size?: SwitchSize;
}
