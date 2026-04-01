import React from 'react';
import clsx from 'clsx';
import './TextInput.css';
import type { TextInputProps } from './TextInput.types';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-text-input');

export const TextInput = React.forwardRef<HTMLDivElement, TextInputProps>(
  function TextInput(
    {
      label,
      helperText,
      startAdornment,
      value,
      defaultValue,
      onChange,
      disabled = false,
      className,
      type = 'text',
      'aria-label': ariaLabel,
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

    React.useEffect(() => {
      if (value !== undefined) {
        setHasValue(Boolean(value));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      onChange?.(e);
    };

    const isLabelFloating = focused || hasValue;

    return (
      <div
        ref={ref}
        className={clsx(
          withBaseName(),
          { [withBaseName('disabled')]: disabled },
          className,
        )}
        aria-disabled={disabled || undefined}
        {...rest}
      >
        <div className="akds-text-input__control">
          {startAdornment && (
            <span className="akds-text-input__start-adornment">
              {startAdornment}
            </span>
          )}
          <div className="akds-text-input__field-wrapper">
            <input
              id={inputId}
              className="akds-text-input__input"
              type={type}
              value={value}
              defaultValue={defaultValue}
              disabled={disabled}
              onChange={handleChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-label={!label ? ariaLabel : undefined}
              aria-describedby={helperText ? helperId : undefined}
            />
            {label && (
              <label
                htmlFor={inputId}
                className={clsx(
                  'akds-text-input__label',
                  { 'akds-text-input__label--floating': isLabelFloating },
                )}
              >
                {label}
              </label>
            )}
          </div>
        </div>
        {helperText && (
          <p id={helperId} className="akds-text-input__helper-text">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
