import React from 'react';
import clsx from 'clsx';
import './TextInput.css';
import type { TextInputProps } from './TextInput.types';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-text-input');

export const TextInput = React.forwardRef<HTMLDivElement, TextInputProps>(
  function TextInput(
    {
      label,
      helperText,
      startAdornment,
      inputRef,
      wrapperClassName,
      value,
      defaultValue,
      onChange,
      onPointerDown,
      onFocus,
      onBlur,
      disabled = false,
      error = false,
      type = 'text',
      ...rest
    },
    ref,
  ) {
    const inputId = React.useId();
    const helperId = React.useId();

    const [hasValue, setHasValue] = React.useState(
      () => Boolean(value !== undefined ? value : defaultValue),
    );
    const [focused, setFocused] = React.useState(false);
    const [keyboardFocused, setKeyboardFocused] = React.useState(false);
    const pointerActive = React.useRef(false);

    React.useEffect(() => {
      if (value !== undefined) {
        setHasValue(Boolean(value));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      onChange?.(e);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
      pointerActive.current = true;
      onPointerDown?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      setKeyboardFocused(!pointerActive.current);
      pointerActive.current = false;
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setKeyboardFocused(false);
      onBlur?.(e);
    };

    const isLabelFloating = focused || hasValue;

    return (
      <div
        ref={ref}
        className={clsx(
          withBaseName(),
          { [withBaseName('disabled')]: disabled },
          { [withBaseName('error')]: error },
          wrapperClassName,
        )}
        aria-disabled={disabled || undefined}
      >
        <div className={clsx(withBaseName.el('control'), { [`${withBaseName.el('control')}--keyboard-focus`]: keyboardFocused })}>
          {startAdornment && (
            <span className={withBaseName.el('start-adornment')}>
              {startAdornment}
            </span>
          )}
          <div className={withBaseName.el('field-wrapper')}>
            <input
              ref={inputRef}
              id={inputId}
              className={withBaseName.el('input')}
              type={type}
              value={value}
              defaultValue={defaultValue}
              disabled={disabled}
              onChange={handleChange}
              onPointerDown={handlePointerDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-describedby={helperText ? helperId : undefined}
              aria-invalid={error || undefined}
              {...rest}
            />
            {label && (
              <label
                htmlFor={inputId}
                className={clsx(
                  withBaseName.el('label'),
                  { [`${withBaseName.el('label')}--floating`]: isLabelFloating },
                )}
              >
                {label}
              </label>
            )}
          </div>
        </div>
        {helperText && (
          <p id={helperId} className={withBaseName.el('helper-text')}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
