import React from 'react';
import clsx from 'clsx';
import './ActionsMenu.css';
import type { ActionsMenuProps } from './ActionsMenu.types';
import { IconButton } from '../IconButton';
import { Menu } from '../Menu';
import { MoreVertIcon } from '@aknishi/akds-icons';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-actions-menu');

const MENUITEM_SELECTOR = '[role="menuitem"]';

export const ActionsMenu = React.forwardRef<HTMLButtonElement, ActionsMenuProps>(
  function ActionsMenu(
    {
      label,
      trigger,
      children,
      placement = 'bottom-right',
      disabled = false,
      focusableWhenDisabled = false,
      onOpenChange,
      className,
      onClick,
      ...rest
    },
    ref,
  ) {
    const [open, setOpen] = React.useState(false);
    const openRef = React.useRef(false);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    // Menu reports every close the same way, so the reason is recorded here
    // before Menu handles the key: Escape returns focus, Tab does not.
    const returnFocusRef = React.useRef(false);

    const setRefs = React.useCallback((node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    }, [ref]);

    const setOpenState = React.useCallback((next: boolean) => {
      // Menu can request the same close twice (its own keydown handler and
      // its document listener both handle Escape).
      if (openRef.current === next) return;
      openRef.current = next;
      setOpen(next);
      onOpenChange?.(next);
      if (!next && returnFocusRef.current) triggerRef.current?.focus();
      returnFocusRef.current = false;
    }, [onOpenChange]);

    const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      setOpenState(!openRef.current);
    };

    const handleMenuKeyDownCapture = (e: React.KeyboardEvent<HTMLUListElement>) => {
      if (e.key === 'Escape') returnFocusRef.current = true;
    };

    // One delegated handler keeps MenuItem's API unchanged: the item's own
    // onClick has already run by the time the event bubbles up here.
    const handleMenuClick = (e: React.MouseEvent<HTMLUListElement>) => {
      const item = (e.target as Element).closest(MENUITEM_SELECTOR);
      if (!item || item.getAttribute('aria-disabled') === 'true') return;
      returnFocusRef.current = true;
      setOpenState(false);
    };

    // Shared by both triggers: what makes a button open this menu.
    const triggerProps = {
      ref: setRefs,
      'aria-haspopup': 'menu' as const,
      ...(label !== undefined ? { 'aria-label': label } : {}),
      disabled,
      focusableWhenDisabled,
      ...rest,
    };

    const triggerElement = trigger ? (
      React.cloneElement(trigger, {
        ...triggerProps,
        className: clsx(withBaseName(), trigger.props.className, className),
        // The trigger's own onClick still runs before the menu toggles.
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          trigger.props.onClick?.(e);
          handleTriggerClick(e);
        },
      })
    ) : (
      <IconButton
        appearance="transparent"
        className={clsx(withBaseName(), className)}
        onClick={handleTriggerClick}
        {...triggerProps}
        aria-label={label}
      >
        <MoreVertIcon aria-hidden="true" color="currentColor" />
      </IconButton>
    );

    return (
      <>
        {triggerElement}
        <Menu
          open={open}
          onOpenChange={setOpenState}
          triggerRef={triggerRef}
          placement={placement}
          className={withBaseName.el('menu')}
          onKeyDownCapture={handleMenuKeyDownCapture}
          onClick={handleMenuClick}
        >
          {children}
        </Menu>
      </>
    );
  },
);

ActionsMenu.displayName = 'ActionsMenu';
