import React from 'react';
import clsx from 'clsx';
import './GenerationLoader.css';
import type { GenerationLoaderProps } from './GenerationLoader.types';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-generation-loader');

export const GenerationLoader = React.forwardRef<HTMLDivElement, GenerationLoaderProps>(
  function GenerationLoader(
    {
      label,
      size = 'md',
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label={typeof label === 'string' ? label : label == null ? 'Generating' : undefined}
        className={clsx(withBaseName(), withBaseName(size), className)}
        {...rest}
      >
        {label != null && <span className={withBaseName.el('label')}>{label}</span>}
        <span className={withBaseName.el('dots')} aria-hidden="true">
          <span className={withBaseName.el('dot')} />
          <span className={withBaseName.el('dot')} />
          <span className={withBaseName.el('dot')} />
        </span>
      </div>
    );
  },
);

GenerationLoader.displayName = 'GenerationLoader';
