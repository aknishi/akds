import React from 'react';

export interface TextInputProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The floating label text. */
  label?: string;
  /** Helper text rendered below the input. */
  helperText?: string;
  /** Element rendered before the input (e.g. an icon). */
  startAdornment?: React.ReactNode;
  /** Current value of the input (controlled). */
  value?: string;
  /** Default value (uncontrolled). */
  defaultValue?: string;
  /** onChange handler forwarded to the inner <input>. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** When true, prevents interaction and applies disabled styling. */
  disabled?: boolean;
  /** Accessible name for the inner input when no label is provided. */
  'aria-label'?: string;
  /** The type attribute forwarded to the inner <input>. @default 'text' */
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
}
