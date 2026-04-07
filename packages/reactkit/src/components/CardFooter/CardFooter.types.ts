import React from 'react';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The footer content — typically action buttons. */
  children: React.ReactNode;
}
