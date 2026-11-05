import React from 'react';
import clsx from 'clsx';
import './DataViewActions.css';
import { makePrefixer } from '../utils';

const withBaseName = makePrefixer('akds-dataview-actions');

export interface DataViewActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whatever the team's rowActions or cardActions returned. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Lays out row and card actions the same way everywhere, so teams can pass
 * bare buttons and get consistent spacing and alignment. Internal — not exported.
 */
export function DataViewActions({ children, className, ...rest }: DataViewActionsProps) {
  return <div className={clsx(withBaseName(), className)} {...rest}>{children}</div>;
}
