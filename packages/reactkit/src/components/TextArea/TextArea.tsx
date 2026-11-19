import React from 'react';
import clsx from 'clsx';
import './TextArea.css';
import type { TextAreaProps } from './TextArea.types';
import { makePrefixer } from '../../utils';
import { mergeRefs } from '../../utils/mergeRefs';
import { joinIds } from '../../utils/joinIds';
import { useUserInvalid } from '../../utils/useUserInvalid';
import { FieldErrorIcon } from '../../utils/FieldErrorIcon';

const withBaseName = makePrefixer('akds-text-area');

// Guarded for SSR and test environments without CSS.supports.
function supportsFieldSizing(): boolean {
  return (
    typeof CSS !== 'undefined' &&
    typeof CSS.supports === 'function' &&
    CSS.supports('field-sizing', 'content')
  );
}

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
      onInvalid,
      disabled = false,
      error = false,
      minRows = 3,
      maxRows,
      autoGrow = true,
      resizable = true,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      ...rest
    },
    ref,
  ) {
    const textareaId = React.useId();
    const helperId = React.useId();
    const errorId = React.useId();

    const fieldRef = React.useRef<HTMLTextAreaElement>(null);
    const growWrapRef = React.useRef<HTMLDivElement>(null);
    const userValidity = useUserInvalid(fieldRef);

    const [hasValue, setHasValue] = React.useState(
      () => String(value !== undefined ? value : defaultValue ?? '').length > 0,
    );
    const [focused, setFocused] = React.useState(false);
    // Textareas match :focus-visible on pointer focus too, so a pointer flag
    // is still needed to show the focus ring for keyboard focus only.
    const [keyboardFocused, setKeyboardFocused] = React.useState(false);
    const pointerActive = React.useRef(false);

    // Auto-grow fallback: only where `field-sizing: content` is unsupported,
    // copy the value into the grid mirror's data attribute directly (no
    // re-render per keystroke).
    const needsMirror = React.useRef(false);
    const syncMirror = React.useCallback((text: string) => {
      if (needsMirror.current && growWrapRef.current) {
        growWrapRef.current.dataset.replicatedValue = text;
      }
    }, []);

    React.useEffect(() => {
      needsMirror.current = autoGrow && !supportsFieldSizing();
      if (growWrapRef.current) {
        if (needsMirror.current) {
          growWrapRef.current.dataset.replicatedValue = fieldRef.current?.value ?? '';
        } else {
          delete growWrapRef.current.dataset.replicatedValue;
        }
      }
    }, [autoGrow]);

    React.useEffect(() => {
      if (value !== undefined) {
        setHasValue(String(value).length > 0);
        syncMirror(String(value));
      }
    }, [value, syncMirror]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(e.target.value.length > 0);
      if (value === undefined) syncMirror(e.target.value);
      userValidity.onChange(e);
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
      userValidity.onBlur(e);
      onBlur?.(e);
    };

    const handleInvalid = (e: React.FormEvent<HTMLTextAreaElement>) => {
      userValidity.onInvalid(e);
      onInvalid?.(e);
    };

    const isLabelFloating = focused || hasValue;
    // Native constraint failure (required, minLength…) after interaction.
    // The `error` prop takes precedence and uses helperText as the message.
    const showNativeError = !error && userValidity.userInvalid;
    const nativeErrorMessage = showNativeError ? userValidity.validationMessage : '';
    // aria-invalid stays "false" until the field is user-invalid (rather than
    // unset), so an untouched required field isn't announced as invalid.
    const resolvedAriaInvalid = error ? true : (ariaInvalid ?? userValidity.userInvalid);

    const sizingStyle = {
      '--akds-text-area-min-rows': minRows,
      ...(maxRows !== undefined && { '--akds-text-area-max-rows': maxRows }),
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={clsx(
          withBaseName(),
          { [withBaseName('disabled')]: disabled },
          { [withBaseName('error')]: error },
          { [withBaseName('user-invalid')]: showNativeError },
          { [withBaseName('no-resize')]: !resizable },
          { [withBaseName('fixed-height')]: !autoGrow },
          wrapperClassName,
        )}
        aria-disabled={disabled || undefined}
      >
        <div className={clsx(withBaseName.el('control'), { [withBaseName.el('control') + '--keyboard-focus']: keyboardFocused })}>
          <div className={withBaseName.el('field-wrapper')}>
            <div ref={growWrapRef} className={withBaseName.el('grow-wrap')} style={sizingStyle}>
              <textarea
                ref={mergeRefs(fieldRef, textareaRef)}
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
                onInvalid={handleInvalid}
                aria-describedby={joinIds(
                  ariaDescribedBy,
                  helperText && helperId,
                  nativeErrorMessage && errorId,
                )}
                aria-invalid={resolvedAriaInvalid}
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

TextArea.displayName = 'TextArea';
