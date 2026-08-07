import React from 'react';
import clsx from 'clsx';
import './IconButton.css';
import type { IconButtonProps } from './IconButton.types';
import { Spinner } from '../Spinner';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-icon-button');

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      appearance = 'solid',
      emphasis = 'neutral',
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
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        aria-busy={loading || undefined}
        className={clsx(
          withBaseName(),
          withBaseName(appearance),
          withBaseName(emphasis),
          { [withBaseName('disabled')]: isDisabled },
          className,
        )}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        {loading ? <Spinner /> : children}
        {!prefersReducedMotion && (
          <RippleBase ref={rippleRef} disabled={isDisabled} onDark={appearance === 'solid' && emphasis !== 'neutral'} />
        )}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
