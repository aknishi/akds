import React from 'react';
import clsx from 'clsx';
import './Divider.css';
import type { DividerProps } from './Divider.types';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-divider');

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  function Divider(
    {
      orientation = 'horizontal',
      variant = 'solid',
      label,
      className,
      ...rest
    },
    ref,
  ) {
    if (label) {
      return (
        <div
          role="separator"
          aria-orientation={orientation}
          className={clsx(
            withBaseName(),
            withBaseName(variant),
            withBaseName('labeled'),
            className,
          )}
        >
          <span className="akds-divider__line" aria-hidden="true" />
          <span className="akds-divider__label-text">{label}</span>
          <span className="akds-divider__line" aria-hidden="true" />
        </div>
      );
    }

    return (
      <hr
        ref={ref}
        aria-orientation={orientation}
        className={clsx(
          withBaseName(),
          withBaseName(orientation),
          withBaseName(variant),
          className,
        )}
        {...rest}
      />
    );
  },
);

Divider.displayName = 'Divider';
