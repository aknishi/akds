import React from 'react';
import clsx from 'clsx';
import './Button.css';
import type { ButtonProps } from './Button.types';
import { Spinner } from '../Spinner';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-button');

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      appearance = 'solid',
      emphasis = 'neutral',
      size = 'md',
      loading = false,
      disabled = false,
      focusableWhenDisabled = false,
      className,
      children,
      onClick,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || loading;
    const useAriaDisabled = isDisabled && focusableWhenDisabled;
    const rippleRef = React.useRef<RippleBaseHandle>(null);

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      rippleRef.current?.trigger(e);
      onPointerDown?.(e);
    };

    const handleClick = useAriaDisabled
      ? (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault()
      : onClick;

    return (
      <button
        ref={ref}
        type="button"
        disabled={useAriaDisabled ? undefined : isDisabled || undefined}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading}
        className={clsx(
          withBaseName(),
          withBaseName(size),
          withBaseName(appearance),
          withBaseName(emphasis),
          { [withBaseName('disabled')]: isDisabled },
          className,
        )}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        {loading && <Spinner />}
        {children}
        <RippleBase ref={rippleRef} disabled={isDisabled} onDark={appearance === 'solid' && emphasis !== 'neutral'} />
      </button>
    );
  },
);

Button.displayName = 'Button';
