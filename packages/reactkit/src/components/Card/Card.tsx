import React from 'react';
import clsx from 'clsx';
import './Card.css';
import type { CardProps } from './Card.types';
import { CardHeaderContext } from '../CardHeader/CardHeaderContext';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-card');

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  function Card(
    {
      borderless = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const ctx = React.useMemo(() => ({ borderless }), [borderless]);

    return (
      <CardHeaderContext.Provider value={ctx}>
        <div
          ref={ref}
          className={clsx(
            withBaseName(),
            { [withBaseName('borderless')]: borderless },
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </CardHeaderContext.Provider>
    );
  },
);

Card.displayName = 'Card';
