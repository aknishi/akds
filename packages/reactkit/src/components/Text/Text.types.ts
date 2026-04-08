import React from 'react';

export type TextStyleAs = 'hero' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'label' | 'caption';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Controls the visual typography style applied. Defaults to 'body'. */
  styleAs?: TextStyleAs;
  /** The HTML element to render as. Defaults to the semantic element for the chosen styleAs. */
  as?: React.ElementType;
  /** The text content to display. */
  children: React.ReactNode;
}
