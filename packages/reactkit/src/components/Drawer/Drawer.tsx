import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import './Drawer.css';
import type { DrawerProps } from './Drawer.types';
import { RippleBase } from '../RippleBase';
import type { RippleBaseHandle } from '../RippleBase';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-drawer');

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  function Drawer(
    {
      open,
      onClose,
      side = 'right',
      title,
      children,
      size = 'md',
      disableBackdropClose = false,
      className,
    },
    ref,
  ) {
    const panelRef = React.useRef<HTMLDivElement>(null);
    const closeRippleRef = React.useRef<RippleBaseHandle>(null);
    const titleId = React.useId();

    React.useImperativeHandle(ref, () => panelRef.current!);

    // Focus first focusable element when opened
    React.useEffect(() => {
      if (!open || !panelRef.current) return;
      const firstFocusable = panelRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
      firstFocusable?.focus();
    }, [open]);

    // Close on Escape and trap focus within the panel
    React.useEffect(() => {
      if (!open) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        if (e.key === 'Tab' && panelRef.current) {
          const focusable = Array.from(
            panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
          );
          if (focusable.length === 0) { e.preventDefault(); return; }

          const first = focusable[0]!;
          const last = focusable[focusable.length - 1]!;

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    // Prevent body scroll while drawer is open
    React.useEffect(() => {
      if (!open) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }, [open]);

    if (!open) return null;

    return ReactDOM.createPortal(
      <div
        className="akds-drawer-backdrop"
        onClick={disableBackdropClose ? undefined : onClose}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          className={clsx(
            withBaseName(),
            withBaseName(side),
            withBaseName(size),
            className,
          )}
          onClick={e => e.stopPropagation()}
        >
          <div className="akds-drawer__header">
            {title && (
              <h2 id={titleId} className="akds-drawer__title">{title}</h2>
            )}
            <button
              type="button"
              className="akds-drawer__close"
              onClick={onClose}
              onPointerDown={e => closeRippleRef.current?.trigger(e)}
              aria-label="Close drawer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <RippleBase ref={closeRippleRef} />
            </button>
          </div>
          <div className="akds-drawer__body">{children}</div>
        </div>
      </div>,
      document.body,
    );
  },
);

Drawer.displayName = 'Drawer';
