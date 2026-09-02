import React from 'react';

export interface TfootProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Footer content — typically one or more Tr elements containing Td or Th cells. */
  children: React.ReactNode;
}
