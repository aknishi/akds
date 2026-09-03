import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** className applied to the outer scroll wrapper element. */
  wrapperClassName?: string;
  /** The table content — typically Thead, Tbody, and/or Tfoot. */
  children: React.ReactNode;
}
