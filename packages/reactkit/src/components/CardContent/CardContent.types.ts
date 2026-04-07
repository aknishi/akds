import React from 'react';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The main body content of the card. */
  children: React.ReactNode;
}
