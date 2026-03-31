import React from 'react';
import clsx from 'clsx';
import './Spinner.css';
import type { SpinnerProps } from './Spinner.types';

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  return (
    <span
      aria-hidden="true"
      className={clsx('akds-spinner', `akds-spinner--${size}`, className)}
    />
  );
};

Spinner.displayName = 'Spinner';
