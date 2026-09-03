import React from 'react';
import clsx from 'clsx';
import './TextArea.css';
import type { TextAreaProps } from './TextArea.types';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-text-area');

export const TextArea = React.forwardRef<HTMLDivElement, TextAreaProps>(
  function TextArea(
    {
      label,
      helperText,
      textareaRef,
      wrapperClassName,
      value,
      defaultValue,
      onChange,
      onPointerDown,
      onFocus,
      onBlur,
      disabled = false,
      error = false,
      minRows = 3,
      resizable = true,
      ...rest
    },
    ref,
  ) {
    const textareaId = React.useId();
    const helperId = React.useId();

    const [textValue, setTextValue] = React.useState(
      () => String(value !== undefined ? value : defaultValue ?? ''),
    );
    const [focused, setFocused] = React.useState(false);
    const [keyboardFocused, setKeyboardFocused] = React.useState(false);
    const pointerActive = React.useRef(false);

    React.useEffect(() => {
      if (value !== undefined) {
        setTextValue(String(value));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) {
        setTextValue(e.target.value);
      }
      onChange?.(e);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLTextAreaElement>) => {
      pointerActive.current = true;
      onPointerDown?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(true);
      setKeyboardFocused(!pointerActive.current);
      pointerActive.current = false;
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(false);
      setKeyboardFocused(false);
      onBlur?.(e);
    };

    const isLabelFloating = focused || textValue.length > 0;

    return (
      <div
        ref={ref}
        className={clsx(
          withBaseName(),
          { [withBaseName('disabled')]: disabled },
          { [withBaseName('error')]: error },
          { [withBaseName('no-resize')]: !resizable },
          wrapperClassName,
        )}
        aria-disabled={disabled || undefined}
      >
        <div className={clsx(withBaseName.el('control'), { [withBaseName.el('control') + '--keyboard-focus']: keyboardFocused })}>
          <div className={withBaseName.el('field-wrapper')}>
            <div className={withBaseName.el('grow-wrap')} data-replicated-value={textValue}>
              <textarea
                ref={textareaRef}
                id={textareaId}
                className={withBaseName.el('textarea')}
                rows={minRows}
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
            </div>
            {label && (
              <label
                htmlFor={textareaId}
                className={clsx(
                  withBaseName.el('label'),
                  { [withBaseName.el('label') + '--floating']: isLabelFloating },
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

TextArea.displayName = 'TextArea';
