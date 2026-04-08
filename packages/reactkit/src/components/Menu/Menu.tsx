import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import './Menu.css';
import type { MenuProps, MenuPlacement } from './Menu.types';
import { makePrefixer } from '../../utils';
import { OptionContext } from '../Option/OptionContext';
import type { OptionContextValue } from '../Option/OptionContext';

const withBaseName = makePrefixer('akds-menu');

const MENUITEM_SELECTOR = '[role="menuitem"]';
const GAP = 4;

function calcPosition(
  trigger: HTMLElement,
  menu: HTMLElement,
  placement: MenuPlacement,
): { top: number; left: number } {
  const tr = trigger.getBoundingClientRect();
  const mh = menu.getBoundingClientRect().height;

  let vertical: 'top' | 'bottom' = placement.startsWith('bottom') ? 'bottom' : 'top';
  const horizontal: 'left' | 'right' = placement.endsWith('left') ? 'left' : 'right';

  if (vertical === 'bottom' && tr.bottom + GAP + mh > window.innerHeight) {
    vertical = 'top';
  }

  const top = vertical === 'bottom' ? tr.bottom + GAP : tr.top - mh - GAP;
  const left = horizontal === 'left' ? tr.left : tr.right - menu.getBoundingClientRect().width;

  return { top, left };
}

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
    const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);
    const [mounted, setMounted] = React.useState(open);
    const [closing, setClosing] = React.useState(false);
    const focusedOnOpenRef = React.useRef(false);
    const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const generatedId = React.useId();
    const menuId = id ?? generatedId;

    React.useEffect(() => {
      if (open) {
        if (closeTimerRef.current) {
          clearTimeout(closeTimerRef.current);
          closeTimerRef.current = null;
        }
        setClosing(false);
        setMounted(true);
      } else {
        setClosing(true);
        closeTimerRef.current = setTimeout(() => {
          setMounted(false);
          setClosing(false);
        }, 120);
      }
      return () => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      };
    }, [open]);

    React.useImperativeHandle(ref, () => menuRef.current!);

    const ctx: OptionContextValue = React.useMemo(() => ({
      variant: 'menu',
      isSelected: () => false,
      onSelect: () => {},
      multiple: false,
      parentDisabled: false,
    }), []);

    const updatePosition = React.useCallback(() => {
      if (!triggerRef?.current || !menuRef.current) return;
      const next = calcPosition(triggerRef.current, menuRef.current, placement);
      setPos(prev => (prev?.top === next.top && prev?.left === next.left ? prev : next));
    }, [triggerRef, placement]);

    // Calculate position once the menu is mounted in the DOM
    React.useLayoutEffect(() => {
      if (!mounted || !open || !triggerRef?.current || !menuRef.current) return;
      updatePosition();
    }, [mounted, open, updatePosition]);

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

    // Reset pos and focus flag after the closing animation finishes (when unmounted)
    React.useEffect(() => {
      if (!mounted) {
        setPos(null);
        focusedOnOpenRef.current = false;
      }
    }, [mounted]);

    // Focus the first item once after open — for portal, wait until pos is set
    React.useEffect(() => {
      if (!open || focusedOnOpenRef.current) return;
      if (triggerRef && !pos) return;
      const first = menuRef.current?.querySelector<HTMLElement>(MENUITEM_SELECTOR);
      if (first) {
        first.focus();
        focusedOnOpenRef.current = true;
      }
    }, [open, pos, triggerRef]);

    React.useEffect(() => {
      if (!open || !triggerRef?.current) return;
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }, [open, triggerRef, updatePosition]);

    React.useEffect(() => {
      if (!open) return;

      const handleOutsideMouseDown = (e: MouseEvent) => {
        const target = e.target as Node;
        if (menuRef.current?.contains(target)) return;
        if (triggerRef?.current?.contains(target)) return;
        onOpenChange?.(false);
      };

      const handleDocKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onOpenChange?.(false);
        }
      };

      document.addEventListener('mousedown', handleOutsideMouseDown);
      document.addEventListener('keydown', handleDocKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleOutsideMouseDown);
        document.removeEventListener('keydown', handleDocKeyDown);
      };
    }, [open, triggerRef, onOpenChange]);

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
          className={clsx(withBaseName(), { [withBaseName('closing')]: closing }, className)}
          style={
            triggerRef
              ? {
                  position: 'fixed',
                  top: pos?.top ?? 0,
                  left: pos?.left ?? 0,
                  opacity: pos ? undefined : 0,
                  pointerEvents: pos ? undefined : 'none',
                }
              : undefined
          }
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {children}
        </ul>
      </OptionContext.Provider>
    );

    if (triggerRef) {
      return ReactDOM.createPortal(menu, document.body);
    }

    return menu;
  },
);

Menu.displayName = 'Menu';
