import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import './Menu.css';
import type { MenuProps } from './Menu.types';
import { makePrefixer } from '../../utils';
import { OptionContext } from '../Option/OptionContext';
import type { OptionContextValue } from '../Option/OptionContext';
import { useAnchoredPopover } from '../../utils/useAnchoredPopover';

const withBaseName = makePrefixer('akds-menu');

const MENUITEM_SELECTOR = '[role="menuitem"]';

export const Menu = React.forwardRef<HTMLUListElement, MenuProps>(
  function Menu(
    {
      open = false,
      onOpenChange,
      className,
      children,
      onKeyDown,
      triggerRef,
      placement = 'bottom-left',
      id,
      ...rest
    },
    ref,
  ) {
    const menuRef = React.useRef<HTMLUListElement>(null);
    const focusedOnOpenRef = React.useRef(false);
    const pointerOpenRef = React.useRef(false);
    const generatedId = React.useId();
    const menuId = id ?? generatedId;

    const onOpenChangeRef = React.useRef(onOpenChange);
    onOpenChangeRef.current = onOpenChange;
    const handleDismiss = React.useCallback(() => onOpenChangeRef.current?.(false), []);

    const {
      mounted,
      native,
      popoverProps,
      position,
      usesJsPosition,
      skipFocusRestore,
    } = useAnchoredPopover({
      open,
      popoverRef: menuRef,
      anchorRef: triggerRef,
      mode: 'auto',
      placement,
      legacyPositioning: 'js',
      onDismiss: handleDismiss,
      restoreFocus: true,
    });

    React.useImperativeHandle(ref, () => menuRef.current!);

    const ctx: OptionContextValue = React.useMemo(() => ({
      variant: 'menu',
      isSelected: () => false,
      onSelect: () => {},
      multiple: false,
      parentDisabled: false,
    }), []);

    const vertical: 'top' | 'bottom' = position?.vertical ?? (placement.startsWith('top') ? 'top' : 'bottom');

    // Set aria-expanded and aria-controls on the trigger element
    React.useEffect(() => {
      if (!triggerRef?.current) return;
      const trigger = triggerRef.current;
      trigger.setAttribute('aria-expanded', String(open));
      if (open) {
        trigger.setAttribute('aria-controls', menuId);
      } else {
        trigger.removeAttribute('aria-controls');
      }
      return () => {
        trigger.removeAttribute('aria-expanded');
        trigger.removeAttribute('aria-controls');
      };
    }, [open, triggerRef, menuId]);

    // Only keyboard opens move focus into the menu. A pointer click on the
    // trigger leaves focus on the trigger; ArrowDown on the trigger enters.
    React.useEffect(() => {
      const trigger = triggerRef?.current;
      if (!trigger) return;
      const handleClick = (e: MouseEvent) => {
        // detail === 0 → click synthesised from Enter/Space.
        pointerOpenRef.current = e.detail > 0;
        setTimeout(() => { pointerOpenRef.current = false; }, 0);
      };
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'ArrowDown') return;
        e.preventDefault();
        if (menuRef.current && open) {
          menuRef.current.querySelector<HTMLElement>(MENUITEM_SELECTOR)?.focus();
        } else {
          onOpenChangeRef.current?.(true);
        }
      };
      trigger.addEventListener('click', handleClick, true);
      trigger.addEventListener('keydown', handleKeyDown);
      return () => {
        trigger.removeEventListener('click', handleClick, true);
        trigger.removeEventListener('keydown', handleKeyDown);
      };
    }, [triggerRef, open]);

    // Focus the first item once after a keyboard/programmatic open. With script
    // positioning, wait until the menu has been placed.
    React.useEffect(() => {
      if (!open) {
        focusedOnOpenRef.current = false;
        return;
      }
      if (focusedOnOpenRef.current) return;
      if (usesJsPosition && !position) return;
      focusedOnOpenRef.current = true;
      if (pointerOpenRef.current && triggerRef?.current) {
        const trigger = triggerRef.current;
        // Some browsers (Safari) don't focus buttons on click; arrow keys must still work.
        if (document.activeElement !== trigger) trigger.focus({ focusVisible: false } as FocusOptions);
        return;
      }
      menuRef.current?.querySelector<HTMLElement>(MENUITEM_SELECTOR)?.focus();
    }, [open, position, usesJsPosition, triggerRef]);

    // Without native popover (inline menus, older browsers) handle outside
    // clicks and Escape from script; native popovers light-dismiss themselves.
    React.useEffect(() => {
      if (!open || native) return;

      const handleOutsideMouseDown = (e: MouseEvent) => {
        const target = e.target as Node;
        if (menuRef.current?.contains(target)) return;
        if (triggerRef?.current?.contains(target)) return;
        onOpenChangeRef.current?.(false);
      };

      const handleDocKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onOpenChangeRef.current?.(false);
        }
      };

      document.addEventListener('mousedown', handleOutsideMouseDown);
      document.addEventListener('keydown', handleDocKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleOutsideMouseDown);
        document.removeEventListener('keydown', handleDocKeyDown);
      };
    }, [open, native, triggerRef]);

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
        case 'Tab':
          // Tab leaves the menu system — don't pull focus back to the trigger.
          skipFocusRestore();
          onOpenChange?.(false);
          break;
      }

      onKeyDown?.(e);
    };

    if (!mounted) return null;

    const menu = (
      <OptionContext.Provider value={ctx}>
        <ul
          ref={menuRef}
          role="menu"
          id={menuId}
          className={clsx(
            withBaseName(),
            { [withBaseName('open')]: open, [withBaseName('top')]: vertical === 'top' },
            className,
          )}
          data-placement={triggerRef ? placement : undefined}
          style={
            usesJsPosition
              ? {
                  position: 'fixed',
                  top: position?.top ?? 0,
                  left: position?.left ?? 0,
                  opacity: position ? undefined : 0,
                  pointerEvents: position ? undefined : 'none',
                }
              : undefined
          }
          onKeyDown={handleKeyDown}
          {...popoverProps}
          {...rest}
        >
          {children}
        </ul>
      </OptionContext.Provider>
    );

    // A native popover renders in place (the top layer handles stacking and
    // keeps it inside any modal <dialog>); older browsers fall back to a portal.
    if (triggerRef && !native) {
      return ReactDOM.createPortal(menu, document.body);
    }

    return menu;
  },
);

Menu.displayName = 'Menu';
