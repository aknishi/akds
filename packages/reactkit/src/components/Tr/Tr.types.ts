import React from 'react';

export interface TrProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** The cells in this row — typically Th and/or Td elements. */
  children: React.ReactNode;
}
