import React from 'react';
import clsx from 'clsx';
import './Tab.css';
import type { TabProps } from './Tab.types';
import { TabContext } from './TabContext';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-tab');

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  function Tab(
    {
      value,
      disabled = false,
      className,
      children,
      onClick,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const { activeTab, onTabChange } = React.useContext(TabContext);
    const isActive = activeTab === value;
    const rippleRef = React.useRef<RippleBaseHandle>(null);

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      rippleRef.current?.trigger(e);
      onPointerDown?.(e);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        onTabChange(value);
        onClick?.(e);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        tabIndex={isActive ? 0 : -1}
        className={clsx(
          withBaseName(),
          { [withBaseName('active')]: isActive },
          { [withBaseName('disabled')]: disabled },
          className,
        )}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        {children}
        <RippleBase ref={rippleRef} disabled={disabled} color="var(--akds-color-interaction-hover-overlay)"/>
      </button>
    );
  },
);

Tab.displayName = 'Tab';
