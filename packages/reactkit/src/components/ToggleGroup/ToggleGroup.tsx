import React from 'react';
import clsx from 'clsx';
import './ToggleGroup.css';
import type { ToggleGroupProps } from './ToggleGroup.types';
import { ToggleButtonContext } from '../ToggleButton/ToggleButtonContext';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-toggle-group');

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  function ToggleGroup(
    {
      value,
      defaultValue = '',
      onChange,
      disabled = false,
      size = 'md',
      className,
      children,
      onKeyDown,
      ...rest
    },
    ref,
  ) {
    const groupRef = React.useRef<HTMLDivElement>(null);
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const resolvedValue = isControlled ? value! : internalValue;

    const [indicatorStyle, setIndicatorStyle] = React.useState({
      transform: 'translateX(0px)',
      width: 0,
    });

    React.useImperativeHandle(ref, () => groupRef.current!);

    const handleChange = React.useCallback(
      (next: string) => {
        if (!isControlled) setInternalValue(next);
        onChange?.(next);
      },
      [isControlled, onChange],
    );

    const ctx = React.useMemo(
      () => ({ value: resolvedValue, onChange: handleChange, disabled, size }),
      [resolvedValue, handleChange, disabled, size],
    );

    React.useLayoutEffect(() => {
      const container = groupRef.current;
      if (!container) return;

      const updateIndicator = () => {
        const activeEl = container.querySelector<HTMLElement>('.akds-toggle-button--active');
        setIndicatorStyle(
          activeEl
            ? { transform: `translateX(${activeEl.offsetLeft}px)`, width: activeEl.offsetWidth }
            : { transform: 'translateX(0px)', width: 0 },
        );
      };

      updateIndicator();

      const observer = new ResizeObserver(updateIndicator);
      observer.observe(container);

      return () => observer.disconnect();
    }, [resolvedValue, children]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const buttons = Array.from(
        groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)') ?? [],
      );
      const idx = buttons.indexOf(document.activeElement as HTMLButtonElement);

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          buttons[(idx + 1) % buttons.length]?.focus();
          buttons[(idx + 1) % buttons.length]?.click();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          buttons[(idx - 1 + buttons.length) % buttons.length]?.focus();
          buttons[(idx - 1 + buttons.length) % buttons.length]?.click();
          break;
        case 'Home':
          e.preventDefault();
          buttons[0]?.focus();
          buttons[0]?.click();
          break;
        case 'End':
          e.preventDefault();
          buttons[buttons.length - 1]?.focus();
          buttons[buttons.length - 1]?.click();
          break;
        default:
          onKeyDown?.(e);
      }
    };

    return (
      <ToggleButtonContext.Provider value={ctx}>
        <div
          ref={groupRef}
          role="radiogroup"
          className={clsx(withBaseName(), { [withBaseName('disabled')]: disabled }, className)}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          <span className={withBaseName.el('indicator')} style={indicatorStyle} />
          {children}
        </div>
      </ToggleButtonContext.Provider>
    );
  },
);

ToggleGroup.displayName = 'ToggleGroup';
