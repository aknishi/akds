import React from 'react';
import clsx from 'clsx';
import './Option.css';
import type { OptionProps } from './Option.types';
import { OptionContext } from './OptionContext';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-option');

export const Option = React.forwardRef<HTMLElement, OptionProps>(
  function Option(
    {
      value,
      disabled = false,
      trailingElement,
      className,
      children,
      onClick,
      onKeyDown,
      ...rest
    },
    ref,
  ) {
    const ctx = React.useContext(OptionContext);
    const effectiveDisabled = disabled || ctx.parentDisabled;
    const selected = value !== undefined ? ctx.isSelected(value) : false;
    const rippleRef = React.useRef<RippleBaseHandle>(null);

    if (ctx.variant === 'menu') {
      const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
        rippleRef.current?.trigger(e);
      };

      const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (effectiveDisabled) {
          e.preventDefault();
          return;
        }
        (onClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(e);
      };

      return (
        <li role="presentation">
          <button
            ref={ref as React.Ref<HTMLButtonElement>}
            type="button"
            role="menuitem"
            disabled={effectiveDisabled}
            aria-disabled={effectiveDisabled || undefined}
            className={clsx(
              withBaseName(),
              { [withBaseName('disabled')]: effectiveDisabled },
              className,
            )}
            onPointerDown={handlePointerDown}
            onClick={handleClick}
            {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          >
            {children}
            {trailingElement && (
              <span className="akds-option__trailing" aria-hidden="true">
                {trailingElement}
              </span>
            )}
            <RippleBase ref={rippleRef} disabled={effectiveDisabled} />
          </button>
        </li>
      );
    }

    // Listbox variant
    const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
      if (effectiveDisabled) return;
      if (value !== undefined) ctx.onSelect(value);
      (onClick as React.MouseEventHandler<HTMLLIElement> | undefined)?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && !effectiveDisabled) {
        e.preventDefault();
        if (value !== undefined) ctx.onSelect(value);
      }
      (onKeyDown as React.KeyboardEventHandler<HTMLLIElement> | undefined)?.(e);
    };

    return (
      <li
        ref={ref as React.Ref<HTMLLIElement>}
        role="option"
        aria-selected={selected}
        aria-disabled={effectiveDisabled || undefined}
        tabIndex={effectiveDisabled ? -1 : 0}
        className={clsx(
          withBaseName(),
          {
            [withBaseName('selected')]: selected,
            [withBaseName('disabled')]: effectiveDisabled,
          },
          className,
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...(rest as React.LiHTMLAttributes<HTMLLIElement>)}
      >
        {ctx.multiple && (
          <span className="akds-option__checkbox" aria-hidden="true">
            <span className={clsx(
              'akds-option__checkbox-box',
              { 'akds-option__checkbox-box--checked': selected },
            )}>
              <svg
                className="akds-option__checkbox-icon"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <polyline
                  points="3,8.5 6.5,12 13,4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </span>
        )}
        {children}
        {!ctx.multiple && selected && (
          <span className="akds-option__checkmark" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3,8.5 6.5,12 13,4" />
            </svg>
          </span>
        )}
      </li>
    );
  },
);

Option.displayName = 'Option';
