import React from 'react';
import clsx from 'clsx';
import './CardFooter.css';
import type { CardFooterProps } from './CardFooter.types';
import { CardHeaderContext } from '../CardHeader/CardHeaderContext';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-card-footer');

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter(
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

CardFooter.displayName = 'CardFooter';
