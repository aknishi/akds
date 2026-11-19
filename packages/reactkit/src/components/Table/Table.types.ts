import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** className applied to the outer scroll wrapper element. */
  wrapperClassName?: string;
  /**
   * Attributes for the outer scroll wrapper. When the table can overflow
   * horizontally, pass `role="region"`, `tabIndex={0}`, and an accessible
   * name (`aria-labelledby` pointing at the caption, or `aria-label`) so
   * keyboard users can scroll it.
   */
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  /** The table content — typically Thead, Tbody, and/or Tfoot. */
  children: React.ReactNode;
}
