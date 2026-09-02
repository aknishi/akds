import React from 'react';
import clsx from 'clsx';
import './Alert.css';
import type { AlertEmphasis, AlertProps } from './Alert.types';
import { InfoIcon, CheckCircleIcon, WarningIcon, ErrorIcon } from '@aknishi/akds-icons';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-alert');

const EMPHASIS_ICON: Record<AlertEmphasis, React.ReactNode> = {
  info: <InfoIcon size="md" />,
  success: <CheckCircleIcon size="md" />,
  warning: <WarningIcon size="md" />,
  error: <ErrorIcon size="md" />,
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(
    {
      emphasis = 'info',
      variant = 'default',
      icon,
      action,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const resolvedIcon = icon !== undefined ? icon : EMPHASIS_ICON[emphasis];

    return (
      <div
        ref={ref}
        role={emphasis === 'error' ? 'alert' : 'status'}
        aria-live={emphasis === 'error' ? 'assertive' : 'polite'}
        className={clsx(withBaseName(), withBaseName(emphasis), withBaseName(variant), className)}
        {...rest}
      >
        {resolvedIcon && (
          <span className={withBaseName.el('icon')} aria-hidden="true">
            {resolvedIcon}
          </span>
        )}
        <div className={withBaseName.el('content')}>{children}</div>
        {action && <div className={withBaseName.el('action')}>{action}</div>}
      </div>
    );
  },
);

Alert.displayName = 'Alert';
