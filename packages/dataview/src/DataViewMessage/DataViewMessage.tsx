import React from 'react';
import clsx from 'clsx';
import './DataViewMessage.css';
import type { DataViewMessageProps } from './DataViewMessage.types';
import { makePrefixer } from '../utils';

const withBaseName = makePrefixer('akds-dataview-message');

/**
 * The layout of DataView's loading, error, and empty states: an icon, a
 * title, a description, and an action, centred. Exported so custom states
 * can reuse it and keep the same look.
 */
export const DataViewMessage = React.forwardRef<HTMLDivElement, DataViewMessageProps>(
  function DataViewMessage(
    {
      icon,
      title,
      description,
      action,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <div ref={ref} className={clsx(withBaseName(), className)} {...rest}>
        {icon && <span className={withBaseName.el('icon')} aria-hidden="true">{icon}</span>}
        <p className={withBaseName.el('title')}>{title}</p>
        {description && <p className={withBaseName.el('description')}>{description}</p>}
        {action && <div className={withBaseName.el('action')}>{action}</div>}
      </div>
    );
  },
);

DataViewMessage.displayName = 'DataViewMessage';
