import React from 'react';
import clsx from 'clsx';
import './Tbody.css';
import type { TbodyProps } from './Tbody.types';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-tbody');

export const Tbody = React.forwardRef<HTMLTableSectionElement, TbodyProps>(
  function Tbody(
    {
      striped = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <tbody
        ref={ref}
        className={clsx(
          withBaseName(),
          { [withBaseName('striped')]: striped },
          className,
        )}
        {...rest}
      >
        {children}
      </tbody>
    );
  },
);

Tbody.displayName = 'Tbody';
