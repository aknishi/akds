import React from 'react';
import clsx from 'clsx';
import './CardHeader.css';
import type { CardHeaderProps } from './CardHeader.types';
import { CardHeaderContext } from './CardHeaderContext';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-card-header');

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader(
    {
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const { borderless } = React.useContext(CardHeaderContext);

    return (
      <div
        ref={ref}
        className={clsx(
          withBaseName(),
          { [withBaseName('divided')]: !borderless },
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

CardHeader.displayName = 'CardHeader';
