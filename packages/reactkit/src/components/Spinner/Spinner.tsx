import React from 'react';
import clsx from 'clsx';
import './Spinner.css';
import type { SpinnerProps } from './Spinner.types';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-spinner');

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className, label }) => {
  return (
    <span
      {...(label
        ? { role: 'progressbar', 'aria-label': label }
        : { 'aria-hidden': true })}
      className={clsx(withBaseName(), withBaseName(size), className)}
    />
  );
};

Spinner.displayName = 'Spinner';
