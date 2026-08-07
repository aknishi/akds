import React from 'react';
import clsx from 'clsx';
import './Accordion.css';
import type { AccordionProps } from './Accordion.types';
import { AccordionItemContext } from '../AccordionItem/AccordionItemContext';
import type { AccordionItemContextValue } from '../AccordionItem/AccordionItemContext';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-accordion');

function toArray(v: string | string[] | undefined): string[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(
    {
      expanded,
      defaultExpanded,
      onChange,
      multiple = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const isControlled = expanded !== undefined;
    const [internalExpanded, setInternalExpanded] = React.useState<string[]>(
      () => toArray(defaultExpanded),
    );
    const resolvedExpanded = isControlled ? toArray(expanded) : internalExpanded;

    const handleToggle = React.useCallback(
      (value: string) => {
        let next: string[];
        if (multiple) {
          next = resolvedExpanded.includes(value)
            ? resolvedExpanded.filter(v => v !== value)
            : [...resolvedExpanded, value];
        } else {
          next = resolvedExpanded.includes(value) ? [] : [value];
        }
        if (!isControlled) setInternalExpanded(next);
        onChange?.(multiple ? next : (next[0] ?? ''));
      },
      [multiple, resolvedExpanded, isControlled, onChange],
    );

    const ctx: AccordionItemContextValue = React.useMemo(
      () => ({
        isExpanded: (v: string) => resolvedExpanded.includes(v),
        onToggle: handleToggle,
      }),
      [resolvedExpanded, handleToggle],
    );

    return (
      <AccordionItemContext.Provider value={ctx}>
        <div
          ref={ref}
          className={clsx(withBaseName(), className)}
          {...rest}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);

Accordion.displayName = 'Accordion';
