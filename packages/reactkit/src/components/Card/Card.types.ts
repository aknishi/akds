import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When true, removes the border and hides the dividers in CardHeader and CardFooter. */
  borderless?: boolean;
  /** The card content — typically CardHeader, CardContent, and/or CardFooter. */
  children: React.ReactNode;
}
