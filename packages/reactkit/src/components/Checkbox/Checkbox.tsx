import React from 'react';
import clsx from 'clsx';
import './Checkbox.css';
import type { CheckboxProps } from './Checkbox.types';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-checkbox');

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      checked,
      defaultChecked,
      onChange,
      name,
      value,
      indeterminate = false,
      disabled = false,
      size = 'md',
      className,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const rippleRef = React.useRef<RippleBaseHandle>(null);

    const callbackRef = React.useCallback(
      (el: HTMLInputElement | null) => {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
      },
      [ref],
    );

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handlePointerDown = (e: React.PointerEvent<HTMLLabelElement>) => {
      rippleRef.current?.trigger(e);
      onPointerDown?.(e);
    };

    return (
      <label
        className={clsx(
          withBaseName(),
          withBaseName(size),
          { [withBaseName('disabled')]: disabled },
          className,
        )}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        <input
          ref={callbackRef}
          type="checkbox"
          className={withBaseName('input')}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          name={name}
          value={value as string | number | readonly string[] | undefined}
          disabled={disabled}
          aria-disabled={disabled || undefined}
        />
        <span className={withBaseName('indicator')} aria-hidden="true">
          <svg
            className={withBaseName('check-icon')}
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
          <svg
            className={withBaseName('indeterminate-icon')}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <line x1="3" y1="8" x2="13" y2="8" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <RippleBase ref={rippleRef} disabled={disabled} />
        </span>
        {label !== undefined && (
          <span className={withBaseName('label')}>{label}</span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
