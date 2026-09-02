import React from 'react';
import clsx from 'clsx';
import './Table.css';
import type { TableProps } from './Table.types';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-table');

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  function Table(
    {
      wrapperClassName,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <div className={clsx(withBaseName.el('wrapper'), wrapperClassName)}>
        <table
          ref={ref}
          className={clsx(withBaseName(), className)}
          {...rest}
        >
          {children}
        </table>
      </div>
    );
  },
);

Table.displayName = 'Table';
