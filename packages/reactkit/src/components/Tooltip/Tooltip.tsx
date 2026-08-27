import React from 'react';
import clsx from 'clsx';
import './Tooltip.css';
import type { TooltipProps } from './Tooltip.types';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-tooltip');

const HIDE_DURATION = 160;

export const Tooltip: React.FC<TooltipProps> = function Tooltip({
  content,
  children,
  placement = 'top',
  open,
  onOpenChange,
}) {
  const isControlled = open !== undefined;
  const [internalVisible, setInternalVisible] = React.useState(false);
  const [hiding, setHiding] = React.useState(false);
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasVisibleRef = React.useRef(false);
  const tooltipId = React.useId();

  const child = React.Children.only(children);
  const visible = open ?? internalVisible;

  // Drives the hiding grace-period animation off visibility transitions, rather than
  // from the event handlers directly, so controlled and uncontrolled usage animate the same way.
  React.useLayoutEffect(() => {
    if (visible) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setHiding(false);
      wasVisibleRef.current = true;
    } else if (wasVisibleRef.current) {
      wasVisibleRef.current = false;
      setHiding(true);
      hideTimerRef.current = setTimeout(() => {
        setHiding(false);
        hideTimerRef.current = null;
      }, HIDE_DURATION);
    }
  }, [visible]);

  React.useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const show = () => {
    if (!isControlled) setInternalVisible(true);
    onOpenChange?.(true);
  };

  const hide = () => {
    if (!isControlled) setInternalVisible(false);
    onOpenChange?.(false);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    show();
    (child.props as React.HTMLAttributes<HTMLElement>).onMouseEnter?.(e as React.MouseEvent<HTMLElement>);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    hide();
    (child.props as React.HTMLAttributes<HTMLElement>).onMouseLeave?.(e as React.MouseEvent<HTMLElement>);
  };

  const handleFocus = (e: React.FocusEvent) => {
    show();
    (child.props as React.HTMLAttributes<HTMLElement>).onFocus?.(e as React.FocusEvent<HTMLElement>);
  };

  const handleBlur = (e: React.FocusEvent) => {
    hide();
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
          { [withBaseName('hiding')]: hiding },
        )}
        aria-hidden={!visible && !hiding || undefined}
      >
        {content}
      </span>
    </span>
  );
};

Tooltip.displayName = 'Tooltip';
