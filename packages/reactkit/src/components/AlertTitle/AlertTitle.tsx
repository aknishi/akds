import React from 'react';
import clsx from 'clsx';
import './AlertTitle.css';
import type { AlertTitleProps } from './AlertTitle.types';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-alert-title');

export const AlertTitle = React.forwardRef<HTMLDivElement, AlertTitleProps>(
  function AlertTitle(
    {
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={clsx(withBaseName(), className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

AlertTitle.displayName = 'AlertTitle';
