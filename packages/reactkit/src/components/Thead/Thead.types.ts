import React from 'react';

export interface TheadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Header content — typically one or more Tr elements containing Th cells. */
  children: React.ReactNode;
}
