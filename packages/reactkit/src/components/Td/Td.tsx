import React from 'react';
import clsx from 'clsx';
import './Td.css';
import type { TdProps } from './Td.types';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-td');

export const Td = React.forwardRef<HTMLTableCellElement, TdProps>(
  function Td(
    {
      align,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <td
        ref={ref}
        className={clsx(
          withBaseName(),
          { [withBaseName('center')]: align === 'center' },
          { [withBaseName('right')]: align === 'right' },
          className,
        )}
        {...rest}
      >
        {children}
      </td>
    );
  },
);

Td.displayName = 'Td';
