import React from 'react';
import clsx from 'clsx';
import './ToggleButton.css';
import type { ToggleButtonProps } from './ToggleButton.types';
import { ToggleButtonContext } from './ToggleButtonContext';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-toggle-button');

export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ToggleButton(
    {
      value,
      pressed,
      defaultPressed = false,
      onPressedChange,
      disabled = false,
      size = 'md',
      color = 'neutral',
      className,
      children,
      onClick,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const groupContext = React.useContext(ToggleButtonContext);
    const isGrouped = groupContext !== null;

    const [internalPressed, setInternalPressed] = React.useState(defaultPressed);
    const isPressedControlled = pressed !== undefined;
    const resolvedStandalonePressed = isPressedControlled ? pressed : internalPressed;

    const isActive = isGrouped ? groupContext.value === value : resolvedStandalonePressed;
    const resolvedDisabled = disabled || (isGrouped ? groupContext.disabled : false);
    const resolvedSize = isGrouped ? groupContext.size : size;

    const rippleRef = React.useRef<RippleBaseHandle>(null);

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      rippleRef.current?.trigger(e);
      onPointerDown?.(e);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!resolvedDisabled) {
        if (isGrouped) {
          if (value !== undefined) groupContext.onChange(value);
        } else {
          const nextPressed = !resolvedStandalonePressed;
          if (!isPressedControlled) setInternalPressed(nextPressed);
          onPressedChange?.(nextPressed);
        }
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        role={isGrouped ? 'radio' : undefined}
        aria-checked={isGrouped ? isActive : undefined}
        aria-pressed={!isGrouped ? isActive : undefined}
        aria-disabled={resolvedDisabled || undefined}
        disabled={resolvedDisabled}
        tabIndex={isGrouped ? (isActive ? 0 : -1) : undefined}
        className={clsx(
          withBaseName(),
          withBaseName(resolvedSize),
          { [withBaseName('grouped')]: isGrouped },
          { [withBaseName('standalone')]: !isGrouped },
          { [withBaseName(color)]: !isGrouped },
          { [withBaseName('active')]: isActive },
          { [withBaseName('disabled')]: resolvedDisabled },
          className,
        )}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        {children}
        <RippleBase ref={rippleRef} disabled={resolvedDisabled} />
      </button>
    );
  },
);

ToggleButton.displayName = 'ToggleButton';
