import React from 'react';
import clsx from 'clsx';
import './Switch.css';
import type { SwitchProps } from './Switch.types';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-switch');

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  function Switch(
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
      ...rest
    },
    ref,
  ) {
    return (
      <label
        className={clsx(
          withBaseName(),
          withBaseName(size),
          { [withBaseName('disabled')]: disabled },
          className,
        )}
        {...rest}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          className={withBaseName.el('input')}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          name={name}
          value={value}
          disabled={disabled}
          aria-disabled={disabled || undefined}
        />
        <span className={withBaseName.el('track')} aria-hidden="true">
          <span className={withBaseName.el('thumb')} />
        </span>
        {label !== undefined && (
          <span className={withBaseName.el('label')}>{label}</span>
        )}
      </label>
    );
  },
);

Switch.displayName = 'Switch';
