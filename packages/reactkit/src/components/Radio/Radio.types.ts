import React from 'react';

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'onChange'> {
  /** The label text rendered next to the radio button. */
  label?: React.ReactNode;
  /** The checked state (controlled). Overrides RadioGroup value matching. */
  checked?: boolean;
  /** The default checked state (uncontrolled). */
  defaultChecked?: boolean;
  /** Change handler forwarded to the inner <input>. Overrides RadioGroup onChange. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Name attribute for form association. Inherited from RadioGroup when omitted. */
  name?: string;
  /** Value of this radio option. Used for RadioGroup value matching. */
  value?: string | number;
  /** When true, prevents interaction. Also inherited from RadioGroup when omitted. */
  disabled?: boolean;
  /** Sets the size of the radio indicator. */
  size?: RadioSize;
}
