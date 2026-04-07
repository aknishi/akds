import React from 'react';
import clsx from 'clsx';
import './Radio.css';
import type { RadioProps } from './Radio.types';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { RadioGroupContext } from '../RadioGroup/RadioGroupContext';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-radio');

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  function Radio(
    {
      label,
      checked,
      defaultChecked,
      onChange,
      name,
      value,
      disabled = false,
      size = 'md',
      className,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const groupContext = React.useContext(RadioGroupContext);
    const rippleRef = React.useRef<RippleBaseHandle>(null);

    const resolvedName = name ?? groupContext?.name;
    const resolvedDisabled = disabled || (groupContext?.disabled ?? false);
    const resolvedOnChange = onChange ?? groupContext?.onChange;

    // Determine checked state from RadioGroup context when not explicitly set
    const resolvedChecked =
      checked !== undefined
        ? checked
        : groupContext?.value !== undefined && value !== undefined
          ? String(groupContext.value) === String(value)
          : undefined;

    const handlePointerDown = (e: React.PointerEvent<HTMLLabelElement>) => {
      rippleRef.current?.trigger(e);
      onPointerDown?.(e);
    };

    return (
      <label
        className={clsx(
          withBaseName(),
          withBaseName(size),
          { [withBaseName('disabled')]: resolvedDisabled },
          className,
        )}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        <input
          ref={ref}
          type="radio"
          className={withBaseName('input')}
          checked={resolvedChecked}
          defaultChecked={defaultChecked}
          onChange={resolvedOnChange}
          name={resolvedName}
          value={value}
          disabled={resolvedDisabled}
          aria-disabled={resolvedDisabled || undefined}
        />
        <span className={withBaseName('indicator')} aria-hidden="true">
          <span className={withBaseName('dot')} />
          <RippleBase ref={rippleRef} disabled={resolvedDisabled} />
        </span>
        {label !== undefined && (
          <span className={withBaseName('label')}>{label}</span>
        )}
      </label>
    );
  },
);

Radio.displayName = 'Radio';
