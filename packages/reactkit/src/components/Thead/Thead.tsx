import React from 'react';
import clsx from 'clsx';
import './Thead.css';
import type { TheadProps } from './Thead.types';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-thead');

export const Thead = React.forwardRef<HTMLTableSectionElement, TheadProps>(
  function Thead(
    {
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <thead
        ref={ref}
        className={clsx(withBaseName(), className)}
        {...rest}
      >
        {children}
      </thead>
    );
  },
);

Thead.displayName = 'Thead';
