import React from 'react';
import clsx from 'clsx';
import '../Menu/Menu.css';
import '../Option/Option.css';
import './DropdownMenu.css';
import type { DropdownMenuProps } from './DropdownMenu.types';
import { ChevronDownIcon } from '@aknishi/akds-icons';
import { makePrefixer } from '../../utils';
import { OptionContext } from '../Option/OptionContext';
import type { OptionContextValue } from '../Option/OptionContext';

const withBaseName = makePrefixer('akds-dropdown-menu');

const OPTION_SELECTOR = '[role="option"]:not([aria-disabled="true"])';

function getDisplayText(children: React.ReactNode, selected: string | string[]): string {
  const selectedArr = Array.isArray(selected) ? selected : (selected ? [selected] : []);
  const labels: string[] = [];
  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return;
    const { value, children: label } = child.props as { value: string; children: unknown };
    if (value !== undefined && selectedArr.includes(value) && typeof label === 'string') {
      labels.push(label);
    }
  });
  return labels.join(', ');
}

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  function DropdownMenu(
    {
      children,
      label,
      placeholder,
      open,
      onOpenChange,
      selected,
      onChange,
      multiple = false,
      disabled = false,
      fullWidth = false,
      helperText,
      name,
      className,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const isOpenControlled = open !== undefined;
    const triggerId = React.useId();
    const labelId = React.useId();
    const listboxId = React.useId();
    const helperId = React.useId();

    const [internalOpen, setInternalOpen] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const [keyboardFocused, setKeyboardFocused] = React.useState(false);
    const pointerActive = React.useRef(false);

    const resolvedOpen = isOpenControlled ? open! : internalOpen;

    const handleOpenChange = (val: boolean) => {
      if (!isOpenControlled) setInternalOpen(val);
      onOpenChange?.(val);
    };

    const hasValue = selected !== undefined && (
      Array.isArray(selected) ? selected.length > 0 : selected !== ''
    );

    const isLabelFloating = resolvedOpen || focused || hasValue;

    const containerRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const listboxRef = React.useRef<HTMLUListElement>(null);

    React.useImperativeHandle(ref, () => containerRef.current!);

    const isSelected = (v: string): boolean => {
      if (selected === undefined) return false;
      return multiple
        ? (selected as string[]).includes(v)
        : selected === v;
    };

    const displayText = getDisplayText(children, selected ?? (multiple ? [] : ''));

    const handleSelect = (optionValue: string) => {
      let next: string | string[];
      if (multiple) {
        const current = Array.isArray(selected) ? selected : [];
        next = current.includes(optionValue)
          ? current.filter(v => v !== optionValue)
          : [...current, optionValue];
      } else {
        next = optionValue;
      }
      onChange?.(next);
      if (!multiple) handleOpenChange(false);
    };

    const optionCtx: OptionContextValue = {
      variant: 'listbox',
      isSelected,
      onSelect: handleSelect,
      multiple: multiple ?? false,
      parentDisabled: disabled ?? false,
    };

    // Close on outside mousedown
    React.useEffect(() => {
      if (!resolvedOpen) return;
      const handleMouseDown = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          handleOpenChange(false);
        }
      };
      document.addEventListener('mousedown', handleMouseDown);
      return () => document.removeEventListener('mousedown', handleMouseDown);
    }, [resolvedOpen]);

    // Focus first or currently-selected option when listbox opens
    React.useEffect(() => {
      if (!resolvedOpen || !listboxRef.current) return;
      const selectedEl = listboxRef.current.querySelector<HTMLElement>(
        '[role="option"][aria-selected="true"]:not([aria-disabled="true"])',
      );
      const first = listboxRef.current.querySelector<HTMLElement>(OPTION_SELECTOR);
      (selectedEl ?? first)?.focus();
    }, [resolvedOpen]);

    const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        handleOpenChange(true);
      } else if (e.key === 'Escape') {
        handleOpenChange(false);
      }
    };

    const handleListboxKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
      const items = Array.from(
        listboxRef.current?.querySelectorAll<HTMLElement>(OPTION_SELECTOR) ?? [],
      );
      const idx = items.indexOf(document.activeElement as HTMLElement);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          items[(idx + 1) % items.length]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          items[(idx - 1 + items.length) % items.length]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          items[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          items[items.length - 1]?.focus();
          break;
        case 'Escape':
          e.preventDefault();
          handleOpenChange(false);
          triggerRef.current?.focus();
          break;
        case 'Tab':
          handleOpenChange(false);
          break;
      }
    };

    return (
      <div
        ref={containerRef}
        className={clsx(
          withBaseName(),
          { [withBaseName('disabled')]: disabled },
          { [withBaseName('full-width')]: fullWidth },
          className,
        )}
        {...rest}
      >
        {/* ── Control — mirrors TextInput's .akds-text-input__control ── */}
        <div className={clsx(
          'akds-dropdown-menu__control',
          { 'akds-dropdown-menu__control--open': resolvedOpen },
          { 'akds-dropdown-menu__control--keyboard-focus': keyboardFocused },
        )}>
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={resolvedOpen}
            aria-controls={resolvedOpen ? listboxId : undefined}
            aria-labelledby={label ? labelId : undefined}
            aria-label={!label ? ariaLabel : undefined}
            aria-describedby={helperText ? helperId : undefined}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            className={clsx(
              'akds-dropdown-menu__trigger',
              { 'akds-dropdown-menu__trigger--has-value': isLabelFloating },
            )}
            onClick={() => handleOpenChange(!resolvedOpen)}
            onKeyDown={handleTriggerKeyDown}
            onPointerDown={() => { pointerActive.current = true; }}
            onFocus={() => {
              setFocused(true);
              setKeyboardFocused(!pointerActive.current);
              pointerActive.current = false;
            }}
            onBlur={() => {
              setFocused(false);
              setKeyboardFocused(false);
            }}
          >
            <span className="akds-dropdown-menu__value">
              {displayText || (placeholder ?? '\u00A0')}
            </span>
            <span className="akds-dropdown-menu__chevron" aria-hidden="true">
              <ChevronDownIcon />
            </span>
          </button>
          {label && (
            <label
              id={labelId}
              htmlFor={triggerId}
              className={clsx(
                'akds-dropdown-menu__label',
                { 'akds-dropdown-menu__label--floating': isLabelFloating },
              )}
            >
              {label}
            </label>
          )}
        </div>

        {helperText && (
          <p id={helperId} className="akds-dropdown-menu__helper-text">
            {helperText}
          </p>
        )}

        {/* ── Listbox panel — uses .akds-menu for visual parity ── */}
        {resolvedOpen && (
          <OptionContext.Provider value={optionCtx}>
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-multiselectable={multiple || undefined}
              aria-label={label ?? ariaLabel}
              className={clsx('akds-menu', 'akds-dropdown-menu__listbox')}
              onKeyDown={handleListboxKeyDown}
            >
              {children}
            </ul>
          </OptionContext.Provider>
        )}
      </div>
    );
  },
);

DropdownMenu.displayName = 'DropdownMenu';
