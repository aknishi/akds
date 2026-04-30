import React from 'react';

export type TagVariant = 'default' | 'info' | 'success' | 'warning' | 'error';
export type TagSize = 'sm' | 'md' | 'lg';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The visual style of the tag. */
  variant?: TagVariant;
  /** The size of the tag. */
  size?: TagSize;
  /** When provided, renders a dismiss button with this accessible label. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. Defaults to "Remove". */
  dismissLabel?: string;
  /** Content rendered inside the tag. */
  children: React.ReactNode;
}
