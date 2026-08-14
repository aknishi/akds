import React from 'react';
import clsx from 'clsx';
import './AccordionItem.css';
import type { AccordionItemProps } from './AccordionItem.types';
import { KeyboardArrowDownIcon } from '@aknishi/akds-icons';
import { AccordionItemContext } from './AccordionItemContext';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-accordion-item');

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem(
    {
      value,
      title,
      disabled = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const { isExpanded, onToggle } = React.useContext(AccordionItemContext);
    const expanded = isExpanded(value);
    const triggerId = React.useId();
    const panelId = React.useId();
    const rippleRef = React.useRef<RippleBaseHandle>(null);

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      rippleRef.current?.trigger(e);
    };

    const handleClick = () => {
      if (!disabled) onToggle(value);
    };

    return (
      <div
        ref={ref}
        className={clsx(
          withBaseName(),
          { [withBaseName('expanded')]: expanded },
          { [withBaseName('disabled')]: disabled },
          className,
        )}
        {...rest}
      >
        <h3 className={withBaseName.el('heading')}>
          <button
            id={triggerId}
            type="button"
            aria-expanded={expanded}
            aria-controls={panelId}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            className={withBaseName.el('trigger')}
            onClick={handleClick}
            onPointerDown={handlePointerDown}
          >
            <span className={withBaseName.el('title')}>{title}</span>
            <span className={withBaseName.el('icon')} aria-hidden="true">
              <KeyboardArrowDownIcon size="md" color="var(--akds-color-icon-secondary-default)" />
            </span>
            <RippleBase ref={rippleRef} disabled={disabled} />
          </button>
        </h3>
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          hidden={!expanded}
          className={withBaseName.el('panel')}
        >
          <div className={withBaseName.el('panel-inner')}>{children}</div>
        </div>
      </div>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';
