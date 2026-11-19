import React from 'react';
import clsx from 'clsx';
import './VisuallyHidden.css';
import type { VisuallyHiddenProps } from './VisuallyHidden.types';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-visually-hidden');

export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden(
    {
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <span
        ref={ref}
        className={clsx(withBaseName(), className)}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

VisuallyHidden.displayName = 'VisuallyHidden';
