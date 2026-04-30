import React from 'react';
import clsx from 'clsx';
import './Tag.css';
import type { TagProps } from './Tag.types';
import { CloseIcon } from '@aknishi/akds-icons';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-tag');

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  function Tag(
    {
      variant = 'default',
      size = 'md',
      onDismiss,
      dismissLabel = 'Remove',
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <span
        ref={ref}
        className={clsx(
          withBaseName(),
          withBaseName(variant),
          withBaseName(size),
          { [withBaseName('dismissible')]: !!onDismiss },
          className,
        )}
        {...rest}
      >
        <span className="akds-tag__label">{children}</span>
        {onDismiss && (
          <button
            type="button"
            className="akds-tag__dismiss"
            onClick={onDismiss}
            aria-label={dismissLabel}
          >
            <CloseIcon aria-hidden="true" className="akds-tag__dismiss-icon" />
          </button>
        )}
      </span>
    );
  },
);

Tag.displayName = 'Tag';
