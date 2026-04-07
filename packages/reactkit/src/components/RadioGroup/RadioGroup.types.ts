import React from 'react';

export type RadioGroupOrientation = 'horizontal' | 'vertical';

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  /** The shared name for all child Radio inputs. Required for form association. */
  name: string;
  /** The currently selected value (controlled). */
  value?: string | number;
  /** Change handler called when a Radio option is selected. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Accessible label rendered as a <legend>. */
  legend?: React.ReactNode;
  /** When true, disables all child Radio inputs. */
  disabled?: boolean;
  /** Controls the layout direction of the radio options. */
  orientation?: RadioGroupOrientation;
  /** Radio options to render. */
  children: React.ReactNode;
}
