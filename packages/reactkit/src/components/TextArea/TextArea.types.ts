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
  /** Minimum number of visible text rows. Also the fixed row count when autoGrow is false. */
  minRows?: number;
  /** Maximum number of rows the textarea grows to before scrolling. Unset by default (grows without limit). Only applies while autoGrow is true. */
  maxRows?: number;
  /** When true (default), the textarea grows to fit its content (via CSS `field-sizing: content`, with a fallback for older browsers). When false, height stays fixed to minRows and overflowing content scrolls vertically. */
  autoGrow?: boolean;
  /** When true (default), shows the resize handle so the textarea can be dragged taller. When false, the handle is hidden; auto-grow is unaffected (use autoGrow to fix the height). */
  resizable?: boolean;
}
