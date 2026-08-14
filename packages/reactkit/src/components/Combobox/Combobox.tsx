import React from 'react';
import clsx from 'clsx';
import './Combobox.css';
import type { ComboboxProps, ComboboxOption } from './Combobox.types';
import { CloseIcon, KeyboardArrowDownIcon } from '@aknishi/akds-icons';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-combobox');

const OPTION_SELECTOR = '[role="option"]:not([aria-disabled="true"])';
const CHIP_SELECTOR = '[data-combobox-chip]:not(:disabled)';

function toArray(v: string | string[] | undefined): string[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : v ? [v] : [];
}

function getDisplayLabel(options: ComboboxOption[], selected: string[]): string {
  return options
    .filter(o => selected.includes(o.value))
    .map(o => o.label)
    .join(', ');
}

interface ComboboxChipProps {
  label: string;
  disabled?: boolean;
  onDelete: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
}

// Internal only for now — not part of the public component surface.
function ComboboxChip({ label, disabled, onDelete, onKeyDown }: ComboboxChipProps) {
  return (
    <button
      type="button"
      data-combobox-chip
      className={withBaseName.el('chip')}
      disabled={disabled}
      onMouseDown={e => e.preventDefault()}
      onClick={onDelete}
      onKeyDown={onKeyDown}
      aria-label={`Remove ${label}`}
    >
      <span className={withBaseName.el('chip-label')}>{label}</span>
      <CloseIcon aria-hidden="true" className={withBaseName.el('chip-remove-icon')} />
    </button>
  );
}

export const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  function Combobox(
    {
      options,
      value,
      defaultValue,
      onChange,
      label,
      placeholder,
      helperText,
      multiple = false,
      disabled = false,
      fullWidth = false,
      className,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const isControlled = value !== undefined;
    const [internalSelected, setInternalSelected] = React.useState<string[]>(
      () => toArray(defaultValue),
    );
    const resolvedSelected = isControlled ? toArray(value) : internalSelected;

    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const [isAutoFilled, setIsAutoFilled] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    const [keyboardFocused, setKeyboardFocused] = React.useState(false);
    const pointerActive = React.useRef(false);

    const inputId = React.useId();
    const labelId = React.useId();
    const listboxId = React.useId();
    const helperId = React.useId();

    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listboxRef = React.useRef<HTMLUListElement>(null);
    const fieldWrapperRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => containerRef.current!);

    const filteredOptions = React.useMemo(() => {
      const q = isAutoFilled ? '' : inputValue.trim().toLowerCase();
      if (!q) return options;
      return options.filter(o => o.label.toLowerCase().includes(q));
    }, [options, inputValue, isAutoFilled]);

    const isLabelFloating = open || focused || resolvedSelected.length > 0 || inputValue.length > 0;

    const commitSelection = (next: string[]) => {
      if (!isControlled) setInternalSelected(next);
      onChange?.(multiple ? next : (next[0] ?? ''));
    };

    const handleSelect = (optionValue: string) => {
      let next: string[];
      if (multiple) {
        next = resolvedSelected.includes(optionValue)
          ? resolvedSelected.filter(v => v !== optionValue)
          : [...resolvedSelected, optionValue];
        setInputValue('');
      } else {
        next = [optionValue];
        setOpen(false);
        setInputValue('');
        inputRef.current?.blur();
      }
      setIsAutoFilled(false);
      commitSelection(next);
    };

    const findMatchingOption = (raw: string) => {
      const q = raw.trim().toLowerCase();
      if (!q) return undefined;
      return options.find(o => !o.disabled && o.label.trim().toLowerCase() === q);
    };

    const getSoleFilteredOption = () => {
      const enabled = filteredOptions.filter(o => !o.disabled);
      return enabled.length === 1 ? enabled[0] : undefined;
    };

    const handleRemoveChip = (optionValue: string) => {
      commitSelection(resolvedSelected.filter(v => v !== optionValue));
      inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      setIsAutoFilled(false);
      if (!open) setOpen(true);
    };

    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      setKeyboardFocused(!pointerActive.current);
      pointerActive.current = false;
      if (!multiple && resolvedSelected.length > 0) {
        setInputValue(getDisplayLabel(options, resolvedSelected));
        setIsAutoFilled(true);
        e.target.select();
      }
      if (!open && (multiple || e.target.value || resolvedSelected.length === 0)) setOpen(true);
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setKeyboardFocused(false);
      if (!containerRef.current?.contains(e.relatedTarget as Node)) {
        setOpen(false);
        const match = findMatchingOption(inputValue);
        if (match) {
          const next = multiple
            ? (resolvedSelected.includes(match.value) ? resolvedSelected : [...resolvedSelected, match.value])
            : [match.value];
          commitSelection(next);
        }
        setInputValue('');
        setIsAutoFilled(false);
      }
    };

    const handleInputPointerDown = () => {
      pointerActive.current = true;
    };

    const getChips = () =>
      Array.from(fieldWrapperRef.current?.querySelectorAll<HTMLElement>(CHIP_SELECTOR) ?? []);

    const handleChipKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const chips = getChips();
      const idx = chips.indexOf(e.currentTarget);
      if (e.key === 'ArrowLeft') {
        chips[idx - 1]?.focus();
      } else if (idx < chips.length - 1) {
        chips[idx + 1]?.focus();
      } else {
        inputRef.current?.focus();
      }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setInputValue('');
        setIsAutoFilled(false);
      } else if (
        e.key === 'ArrowLeft' &&
        multiple &&
        resolvedSelected.length > 0 &&
        e.currentTarget.selectionStart === 0 &&
        e.currentTarget.selectionEnd === 0
      ) {
        e.preventDefault();
        const chips = getChips();
        chips[chips.length - 1]?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
        const first = listboxRef.current?.querySelector<HTMLElement>(OPTION_SELECTOR);
        first?.focus();
      } else if (e.key === 'Enter') {
        const match = findMatchingOption(inputValue) ?? getSoleFilteredOption();
        if (match) {
          e.preventDefault();
          handleSelect(match.value);
        } else if (!open) {
          setOpen(true);
        }
      } else if (e.key === 'Backspace' && multiple && !inputValue && resolvedSelected.length > 0) {
        const last = resolvedSelected[resolvedSelected.length - 1];
        if (last !== undefined) handleRemoveChip(last);
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
          if (idx <= 0) {
            inputRef.current?.focus();
          } else {
            items[idx - 1]?.focus();
          }
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
          setOpen(false);
          setInputValue('');
          setIsAutoFilled(false);
          inputRef.current?.focus();
          break;
        case 'Tab':
          setOpen(false);
          break;
      }
    };

    const handleControlMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      const target = e.target as HTMLElement;
      if (target.closest(CHIP_SELECTOR) || target === inputRef.current) return;
      e.preventDefault();
      if (document.activeElement === inputRef.current) {
        setOpen(true);
      } else {
        inputRef.current?.focus();
      }
    };

    // Close on outside click
    React.useEffect(() => {
      if (!open) return;
      const handleMouseDown = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
          setInputValue('');
        }
      };
      document.addEventListener('mousedown', handleMouseDown);
      return () => document.removeEventListener('mousedown', handleMouseDown);
    }, [open]);

    const displayLabel = multiple
      ? inputValue
      : (!open && resolvedSelected.length > 0 ? getDisplayLabel(options, resolvedSelected) : inputValue);

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
        <div
          className={clsx(
            withBaseName.el('control'),
            { [withBaseName.el('control') + '--open']: open },
            { [withBaseName.el('control') + '--keyboard-focus']: keyboardFocused },
          )}
          onMouseDown={handleControlMouseDown}
        >
          <div
            ref={fieldWrapperRef}
            className={clsx(
              withBaseName.el('field-wrapper'),
              { [withBaseName.el('field-wrapper') + '--multiple']: multiple },
            )}>
            {multiple && resolvedSelected.map(v => {
              const opt = options.find(o => o.value === v);
              return (
                <ComboboxChip
                  key={v}
                  label={opt ? opt.label : v}
                  disabled={disabled}
                  onDelete={() => handleRemoveChip(v)}
                  onKeyDown={handleChipKeyDown}
                />
              );
            })}
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls={open ? listboxId : undefined}
              aria-labelledby={label ? labelId : undefined}
              aria-label={!label ? ariaLabel : undefined}
              aria-describedby={helperText ? helperId : undefined}
              aria-disabled={disabled || undefined}
              disabled={disabled}
              value={displayLabel}
              placeholder={!label ? (placeholder ?? '') : ''}
              className={clsx(
                withBaseName.el('input'),
                { [withBaseName.el('input') + '--has-value']: isLabelFloating },
              )}
              autoComplete="off"
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onPointerDown={handleInputPointerDown}
              onKeyDown={handleInputKeyDown}
            />
            {label && (
              <label
                id={labelId}
                htmlFor={inputId}
                className={clsx(
                  withBaseName.el('label'),
                  { [withBaseName.el('label') + '--floating']: isLabelFloating },
                )}
              >
                {label}
              </label>
            )}
          </div>
          <span className={withBaseName.el('chevron')} aria-hidden="true">
            <KeyboardArrowDownIcon size="md" color="var(--akds-color-icon-secondary-default)" />
          </span>
        </div>

        {helperText && (
          <p id={helperId} className={withBaseName.el('helper-text')}>{helperText}</p>
        )}

        {open && (
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable={multiple || undefined}
            aria-label={label ?? ariaLabel}
            className={withBaseName.el('listbox')}
            onKeyDown={handleListboxKeyDown}
          >
            {filteredOptions.length === 0 ? (
              <li className={withBaseName.el('no-results')} role="presentation">
                No results
              </li>
            ) : (
              filteredOptions.map(option => {
                const isSelected = resolvedSelected.includes(option.value);
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    tabIndex={option.disabled ? undefined : -1}
                    className={clsx(
                      withBaseName.el('option'),
                      { [withBaseName.el('option') + '--selected']: isSelected },
                      { [withBaseName.el('option') + '--disabled']: option.disabled },
                    )}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      if (!option.disabled) handleSelect(option.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (!option.disabled) handleSelect(option.value);
                      }
                    }}
                  >
                    {multiple && (
                      <span className={withBaseName.el('option-check')} aria-hidden="true">
                        {isSelected && (
                          <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                            <polyline points="3,8.5 6.5,12 13,4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
                          </svg>
                        )}
                      </span>
                    )}
                    {option.label}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    );
  },
);

Combobox.displayName = 'Combobox';
