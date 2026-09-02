import React from 'react';

export interface AlertTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The title content, rendered bold and larger than the alert's body text. */
  children: React.ReactNode;
}
