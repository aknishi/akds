import React from 'react';
import clsx from 'clsx';
import './CardContent.css';
import type { CardContentProps } from './CardContent.types';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-card-content');

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent(
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

CardContent.displayName = 'CardContent';
