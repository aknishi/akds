import React from 'react';
import clsx from 'clsx';
import './Tr.css';
import type { TrProps } from './Tr.types';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-tr');

export const Tr = React.forwardRef<HTMLTableRowElement, TrProps>(
  function Tr(
    {
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <tr
        ref={ref}
        className={clsx(withBaseName(), className)}
        {...rest}
      >
        {children}
      </tr>
    );
  },
);

Tr.displayName = 'Tr';
