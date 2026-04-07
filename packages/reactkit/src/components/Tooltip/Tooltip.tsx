import React from 'react';
import clsx from 'clsx';
import './Tooltip.css';
import type { TooltipProps } from './Tooltip.types';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-tooltip');

export const Tooltip: React.FC<TooltipProps> = function Tooltip({
  content,
  children,
  placement = 'top',
}) {
  const [visible, setVisible] = React.useState(false);
  const tooltipId = React.useId();

  const child = React.Children.only(children);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setVisible(true);
    (child.props as React.HTMLAttributes<HTMLElement>).onMouseEnter?.(e as React.MouseEvent<HTMLElement>);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    setVisible(false);
    (child.props as React.HTMLAttributes<HTMLElement>).onMouseLeave?.(e as React.MouseEvent<HTMLElement>);
  };

  const handleFocus = (e: React.FocusEvent) => {
    setVisible(true);
    (child.props as React.HTMLAttributes<HTMLElement>).onFocus?.(e as React.FocusEvent<HTMLElement>);
  };

  const handleBlur = (e: React.FocusEvent) => {
    setVisible(false);
    (child.props as React.HTMLAttributes<HTMLElement>).onBlur?.(e as React.FocusEvent<HTMLElement>);
  };

  const clonedChild = React.cloneElement(child, {
    'aria-describedby': tooltipId,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <span className={'akds-tooltip__wrapper'}>
      {clonedChild}
      <span
        id={tooltipId}
        role="tooltip"
        className={clsx(
          withBaseName(),
          withBaseName(placement),
          { [withBaseName('visible')]: visible },
        )}
        aria-hidden={!visible || undefined}
      >
        {content}
      </span>
    </span>
  );
};

Tooltip.displayName = 'Tooltip';
