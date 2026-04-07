import React from 'react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** The floating label text. */
  label?: string;
  /** Helper text rendered below the input. */
  helperText?: string;
  /** Element rendered before the input (e.g. an icon). */
  startAdornment?: React.ReactNode;
  /** Ref forwarded to the internal <input> element. */
  inputRef?: React.Ref<HTMLInputElement>;
  /** className applied to the outer wrapper <div>. */
  wrapperClassName?: string;
}
