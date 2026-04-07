import React from 'react';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'onChange'> {
  /** The label text rendered next to the checkbox. */
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
  value?: string | ReadonlyArray<string> | number;
  /** When true, shows the indeterminate state (overrides checked visually). */
  indeterminate?: boolean;
  /** When true, prevents interaction and applies disabled styling. */
  disabled?: boolean;
  /** Sets the size of the checkbox indicator. */
  size?: CheckboxSize;
}
