import React from 'react';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** The floating label text. */
  label?: string;
  /** Helper text rendered below the textarea. */
  helperText?: string;
  /** Ref forwarded to the internal `<textarea>` element. */
  textareaRef?: React.Ref<HTMLTextAreaElement>;
  /** className applied to the outer wrapper `<div>`. */
  wrapperClassName?: string;
  /** When true, applies error styling to the border and helper text. */
  error?: boolean;
  /** Minimum number of visible text rows. Also the fixed row count when resizable is false. */
  minRows?: number;
  /** When true (default), the textarea grows to fit its content and can be dragged taller via the resize handle. When false, height stays fixed to minRows and overflowing content scrolls vertically instead. */
  resizable?: boolean;
}
