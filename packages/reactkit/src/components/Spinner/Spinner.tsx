import React from 'react';
import clsx from 'clsx';
import './Spinner.css';
import type { SpinnerProps } from './Spinner.types';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-spinner');

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  return (
    <span
      aria-hidden="true"
      className={clsx(withBaseName(), withBaseName(size), className)}
    />
  );
};

Spinner.displayName = 'Spinner';
