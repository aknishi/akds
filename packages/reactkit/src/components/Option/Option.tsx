import React from 'react';
import clsx from 'clsx';
import './Option.css';
import type { OptionProps } from './Option.types';
import { OptionContext } from './OptionContext';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { CheckIcon } from '@aknishi/akds-icons';
import { makePrefixer } from '../../utils';

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
      onKeyUp,
      onFocus,
      ...rest
    },
    ref,
  ) {
    const ctx = React.useContext(OptionContext);
    const effectiveDisabled = disabled || ctx.parentDisabled;
    const selected = value !== undefined ? ctx.isSelected(value) : false;
    const rippleRef = React.useRef<RippleBaseHandle>(null);
    // Space activates on keyup (like a native button), but only if the
    // keydown also landed here — e.g. not the Space that opened the listbox.
    const spacePressed = React.useRef(false);

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
            aria-disabled={effectiveDisabled || undefined}
            className={clsx(
              withBaseName(),
              { [withBaseName('disabled')]: effectiveDisabled },
              className,
            )}
            onPointerDown={handlePointerDown}
            onClick={handleClick}
            onKeyDown={onKeyDown as React.KeyboardEventHandler<HTMLButtonElement> | undefined}
            onKeyUp={onKeyUp as React.KeyboardEventHandler<HTMLButtonElement> | undefined}
            onFocus={onFocus as React.FocusEventHandler<HTMLButtonElement> | undefined}
            {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          >
            {children}
            {trailingElement && (
              <span className={withBaseName.el('trailing')} aria-hidden="true">
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
      if (e.key === 'Enter' && !effectiveDisabled) {
        e.preventDefault();
        if (value !== undefined) ctx.onSelect(value);
      } else if (e.key === ' ') {
        // Prevent page scroll; Space activates on keyup.
        e.preventDefault();
        spacePressed.current = true;
      }
      (onKeyDown as React.KeyboardEventHandler<HTMLLIElement> | undefined)?.(e);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLLIElement>) => {
      if (e.key === ' ') {
        const pressed = spacePressed.current;
        spacePressed.current = false;
        if (pressed && !effectiveDisabled && value !== undefined) ctx.onSelect(value);
      }
      (onKeyUp as React.KeyboardEventHandler<HTMLLIElement> | undefined)?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLLIElement>) => {
      if (value !== undefined) ctx.onOptionFocus?.(value);
      (onFocus as React.FocusEventHandler<HTMLLIElement> | undefined)?.(e);
    };

    // Roving tabindex: one Tab stop per listbox; arrow keys move focus.
    const isTabStop = !effectiveDisabled && value !== undefined && (
      ctx.isTabStop ? ctx.isTabStop(value) : selected
    );

    return (
      <li
        ref={ref as React.Ref<HTMLLIElement>}
        role="option"
        aria-selected={selected}
        aria-disabled={effectiveDisabled || undefined}
        tabIndex={isTabStop ? 0 : -1}
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
        onKeyUp={handleKeyUp}
        onFocus={handleFocus}
        {...(rest as React.LiHTMLAttributes<HTMLLIElement>)}
      >
        {ctx.multiple && (
          <span className={withBaseName.el('checkbox')} aria-hidden="true">
            <span className={clsx(
              withBaseName.el('checkbox-box'),
              { [`${withBaseName.el('checkbox-box')}--checked`]: selected },
            )}>
              <svg
                className={withBaseName.el('checkbox-icon')}
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
          <span className={withBaseName.el('checkmark')} aria-hidden="true">
            <CheckIcon />
          </span>
        )}
      </li>
    );
  },
);

Option.displayName = 'Option';
