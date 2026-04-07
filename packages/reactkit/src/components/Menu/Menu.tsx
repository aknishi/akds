import React from 'react';
import clsx from 'clsx';
import './Menu.css';
import type { MenuProps } from './Menu.types';
import { makePrefixer } from '../../utils';
import { OptionContext } from '../Option/OptionContext';
import type { OptionContextValue } from '../Option/OptionContext';

const withBaseName = makePrefixer('akds-menu');

const MENUITEM_SELECTOR = '[role="menuitem"]:not([disabled])';

export const Menu = React.forwardRef<HTMLUListElement, MenuProps>(
  function Menu(
    {
      open = false,
      onOpenChange,
      className,
      children,
      onKeyDown,
      ...rest
    },
    ref,
  ) {
    const menuRef = React.useRef<HTMLUListElement>(null);

    React.useImperativeHandle(ref, () => menuRef.current!);

    const ctx: OptionContextValue = React.useMemo(() => ({
      variant: 'menu',
      isSelected: () => false,
      onSelect: () => {},
      multiple: false,
      parentDisabled: false,
    }), []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
      const items = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>(MENUITEM_SELECTOR) ?? [],
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
          onOpenChange?.(false);
          break;
      }

      onKeyDown?.(e);
    };

    if (!open) return null;

    return (
      <OptionContext.Provider value={ctx}>
        <ul
          ref={menuRef}
          role="menu"
          className={clsx(withBaseName(), className)}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {children}
        </ul>
      </OptionContext.Provider>
    );
  },
);

Menu.displayName = 'Menu';
