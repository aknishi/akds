import React from 'react';
import clsx from 'clsx';
import './Tfoot.css';
import type { TfootProps } from './Tfoot.types';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-tfoot');

export const Tfoot = React.forwardRef<HTMLTableSectionElement, TfootProps>(
  function Tfoot(
    {
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <tfoot
        ref={ref}
        className={clsx(withBaseName(), className)}
        {...rest}
      >
        {children}
      </tfoot>
    );
  },
);

Tfoot.displayName = 'Tfoot';
