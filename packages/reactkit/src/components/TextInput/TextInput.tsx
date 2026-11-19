import React from 'react';
import clsx from 'clsx';
import './TextInput.css';
import type { TextInputProps } from './TextInput.types';
import { makePrefixer } from '../../utils';
import { mergeRefs } from '../../utils/mergeRefs';
import { joinIds } from '../../utils/joinIds';
import { useUserInvalid } from '../../utils/useUserInvalid';
import { FieldErrorIcon } from '../../utils/FieldErrorIcon';

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
      onInvalid,
      disabled = false,
      error = false,
      type = 'text',
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      ...rest
    },
    ref,
  ) {
    const inputId = React.useId();
    const helperId = React.useId();
    const errorId = React.useId();

    const fieldRef = React.useRef<HTMLInputElement>(null);
    const userValidity = useUserInvalid(fieldRef);

    const [hasValue, setHasValue] = React.useState(
      () => Boolean(value !== undefined ? value : defaultValue),
    );
    const [focused, setFocused] = React.useState(false);
    // Text inputs match :focus-visible on pointer focus too, so a pointer flag
    // is still needed to show the focus ring for keyboard focus only.
    const [keyboardFocused, setKeyboardFocused] = React.useState(false);
    const pointerActive = React.useRef(false);

    React.useEffect(() => {
      if (value !== undefined) {
        setHasValue(Boolean(value));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      userValidity.onChange(e);
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
      userValidity.onBlur(e);
      onBlur?.(e);
    };

    const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
      userValidity.onInvalid(e);
      onInvalid?.(e);
    };

    const isLabelFloating = focused || hasValue;
    // Native constraint failure (required, pattern, type…) after interaction.
    // The `error` prop takes precedence and uses helperText as the message.
    const showNativeError = !error && userValidity.userInvalid;
    const nativeErrorMessage = showNativeError ? userValidity.validationMessage : '';
    // aria-invalid stays "false" until the field is user-invalid (rather than
    // unset), so an untouched required field isn't announced as invalid.
    const resolvedAriaInvalid = error ? true : (ariaInvalid ?? userValidity.userInvalid);

    return (
      <div
        ref={ref}
        className={clsx(
          withBaseName(),
          { [withBaseName('disabled')]: disabled },
          { [withBaseName('error')]: error },
          { [withBaseName('user-invalid')]: showNativeError },
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
              ref={mergeRefs(fieldRef, inputRef)}
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
              onInvalid={handleInvalid}
              aria-describedby={joinIds(
                ariaDescribedBy,
                helperText && helperId,
                nativeErrorMessage && errorId,
              )}
              aria-invalid={resolvedAriaInvalid}
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
            {error && <FieldErrorIcon />}
            {helperText}
          </p>
        )}
        {nativeErrorMessage && (
          <p id={errorId} className={withBaseName.el('error-text')}>
            <FieldErrorIcon />
            {nativeErrorMessage}
          </p>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
