import React from 'react';
import clsx from 'clsx';
import './Button.css';
import type { ButtonProps } from './Button.types';
import { Spinner } from '../Spinner';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      appearance = 'solid',
      sentiment  = 'accented',
      size       = 'md',
      loading    = false,
      disabled   = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={clsx(
          'akds-btn',
          `akds-btn--${size}`,
          `akds-btn--${appearance}`,
          `akds-btn--${sentiment}`,
          { 'akds-btn--disabled': isDisabled },
          className,
        )}
        {...rest}
      >
        {loading && <Spinner />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
