import React from 'react';
import clsx from 'clsx';
import '../Menu/Menu.css';
import '../Option/Option.css';
import './DropdownMenu.css';
import type { DropdownMenuProps } from './DropdownMenu.types';
import { KeyboardArrowDownIcon } from '@aknishi/akds-icons';
import { makePrefixer } from '../../utils';
import { OptionContext } from '../Option/OptionContext';
import type { OptionContextValue } from '../Option/OptionContext';
import { useAnchoredPopover } from '../../utils/useAnchoredPopover';

const withBaseName = makePrefixer('akds-dropdown-menu');

const OPTION_SELECTOR = '[role="option"]:not([aria-disabled="true"])';

// Plain text of a React node, e.g. an Option label written as
// `<>Red <small>(warm)</small></>` reads "Red (warm)".
function getNodeText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join('');
  if (React.isValidElement(node)) {
    return getNodeText((node.props as { children?: React.ReactNode }).children);
  }
  return '';
}

// Labels of the selected Option children, looking through fragments.
function getDisplayText(children: React.ReactNode, selected: string | string[]): string {
  const selectedArr = Array.isArray(selected) ? selected : (selected ? [selected] : []);
  const labels: string[] = [];
  const visit = (nodes: React.ReactNode) => {
    React.Children.forEach(nodes, child => {
      if (!React.isValidElement(child)) return;
      const { value, children: label } = child.props as { value?: string; children?: React.ReactNode };
      if (child.type === React.Fragment) {
        visit(label);
      } else if (value !== undefined && selectedArr.includes(value)) {
        const text = getNodeText(label).trim();
        if (text) labels.push(text);
      }
    });
  };
  visit(children);
  return labels.join(', ');
}

// Values of enabled Option children, looking through fragments.
function getEnabledValues(children: React.ReactNode, out: string[] = []): string[] {
  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return;
    const props = child.props as { value?: string; disabled?: boolean; children?: React.ReactNode };
    if (child.type === React.Fragment) {
      getEnabledValues(props.children, out);
    } else if (props.value !== undefined && !props.disabled) {
      out.push(props.value);
    }
  });
  return out;
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
    const controlRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const listboxRef = React.useRef<HTMLUListElement>(null);

    // Top-layer popover anchored to the control: escapes overflow containers
    // and dialogs, flips when it would overflow, and light-dismisses natively.
    const { mounted, native, popoverProps, position, usesJsPosition, skipFocusRestore } = useAnchoredPopover({
      open: resolvedOpen,
      popoverRef: listboxRef,
      anchorRef: controlRef,
      triggerRef,
      mode: 'auto',
      placement: 'bottom-left',
      matchAnchorWidth: true,
      legacyPositioning: 'css',
      onDismiss: () => handleOpenChange(false),
      restoreFocus: true,
    });

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

    // Roving tabindex: the listbox has a single Tab stop — the last focused
    // option, else the first selected option, else the first enabled one.
    const [activeValue, setActiveValue] = React.useState<string | undefined>(undefined);
    const enabledValues = getEnabledValues(children);
    const tabStopValue =
      (activeValue !== undefined && enabledValues.includes(activeValue) ? activeValue : undefined) ??
      enabledValues.find(isSelected) ??
      enabledValues[0];

    const optionCtx: OptionContextValue = {
      variant: 'listbox',
      isSelected,
      onSelect: handleSelect,
      multiple: multiple ?? false,
      parentDisabled: disabled ?? false,
      isTabStop: v => v === tabStopValue,
      onOptionFocus: setActiveValue,
    };

    // Close on outside mousedown — only needed without native light dismiss.
    React.useEffect(() => {
      if (!resolvedOpen || native) return;
      const handleMouseDown = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          handleOpenChange(false);
        }
      };
      document.addEventListener('mousedown', handleMouseDown);
      return () => document.removeEventListener('mousedown', handleMouseDown);
    }, [resolvedOpen, native]);

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
      } else if (e.key === 'Escape' && resolvedOpen) {
        // Consume Escape so a surrounding native <dialog> stays open.
        e.preventDefault();
        handleOpenChange(false);
      }
    };

    const handleListboxKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
      const items = Array.from(
        listboxRef.current?.querySelectorAll<HTMLElement>(OPTION_SELECTOR) ?? [],
      );
      const idx = items.indexOf(document.activeElement as HTMLElement);
      pointerActive.current = false;

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
          skipFocusRestore();
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
        <div ref={controlRef} className={clsx(
          withBaseName.el('control'),
          { [`${withBaseName.el('control')}--open`]: resolvedOpen },
          { [`${withBaseName.el('control')}--keyboard-focus`]: keyboardFocused },
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
            disabled={disabled}
            className={clsx(
              withBaseName.el('trigger'),
              { [`${withBaseName.el('trigger')}--has-value`]: isLabelFloating },
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
            <span className={withBaseName.el('value')}>
              {displayText || (placeholder ?? '\u00A0')}
            </span>
            <span className={withBaseName.el('chevron')} aria-hidden="true">
              <KeyboardArrowDownIcon size="md" color="var(--akds-color-icon-secondary-default)" />
            </span>
          </button>
          {label && (
            <label
              id={labelId}
              htmlFor={triggerId}
              className={clsx(
                withBaseName.el('label'),
                { [`${withBaseName.el('label')}--floating`]: isLabelFloating },
              )}
            >
              {label}
            </label>
          )}
        </div>

        {/* Submits the selection with a surrounding <form>, like a native <select>. */}
        {name !== undefined && (multiple
          ? (Array.isArray(selected) ? selected : []).map(v => (
              <input key={v} type="hidden" name={name} value={v} disabled={disabled} />
            ))
          : <input type="hidden" name={name} value={typeof selected === 'string' ? selected : ''} disabled={disabled} />
        )}

        {helperText && (
          <p id={helperId} className={withBaseName.el('helper-text')}>
            {helperText}
          </p>
        )}

        {/* ── Listbox panel — uses .akds-menu for visual parity ── */}
        {mounted && (
          <OptionContext.Provider value={optionCtx}>
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-multiselectable={multiple || undefined}
              aria-label={label ?? ariaLabel}
              className={clsx('akds-menu', { 'akds-menu--open': resolvedOpen }, withBaseName.el('listbox'))}
              style={
                usesJsPosition
                  ? {
                      top: position?.top ?? 0,
                      left: position?.left ?? 0,
                      width: position?.width,
                      opacity: position ? undefined : 0,
                    }
                  : undefined
              }
              onKeyDown={handleListboxKeyDown}
              // A pointer selection returns focus to the trigger without a focus ring.
              onPointerDown={() => { pointerActive.current = true; }}
              {...popoverProps}
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
