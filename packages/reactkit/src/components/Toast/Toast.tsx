import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import './Toast.css';
import type { ToastEmphasis, ToastOptions, ToastPlacement, ToastProviderProps } from './Toast.types';
import { ToastContext } from './ToastContext';
import { CloseIcon, InfoFilledIcon, CheckCircleFilledIcon, ErrorFilledIcon } from '@aknishi/akds-icons';
import { IconButton } from '../IconButton';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-toast');

// Mirrors --akds-spacing-150 — the gap CSS also uses between stacked toasts.
const STACK_GAP = 12;

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

type PopoverElement = HTMLElement & { showPopover?: () => void };

// Feature-detect the Popover API on the prototype (not via the IDL attribute).
function popoverSupported(): boolean {
  return typeof HTMLElement !== 'undefined' && Object.prototype.hasOwnProperty.call(HTMLElement.prototype, 'popover');
}

function isModalDialog(el: HTMLDialogElement): boolean {
  if (!el.open || !el.isConnected) return false;
  try {
    return el.matches(':modal');
  } catch {
    return true;
  }
}

/**
 * Keeps `host` inside the most recently opened modal <dialog> (else <body>).
 * A modal dialog makes everything outside it inert and covers it with its
 * ::backdrop, so toasts rendered outside it can be neither seen nor dismissed.
 * Inside the dialog they stay interactive, and re-showing the viewport popover
 * puts it above the dialog in the top layer. The host node is moved directly
 * (not re-portaled) so toasts don't remount, re-announce or restart timers.
 */
function useModalHost(host: HTMLElement | null) {
  React.useLayoutEffect(() => {
    if (!host || !popoverSupported() || typeof MutationObserver === 'undefined') return;
    const stack: HTMLDialogElement[] = Array.from(document.querySelectorAll('dialog')).filter(isModalDialog);

    const sync = () => {
      for (let i = stack.length - 1; i >= 0; i -= 1) {
        if (!isModalDialog(stack[i]!)) stack.splice(i, 1);
      }
      const parent = stack[stack.length - 1] ?? document.body;
      if (host.parentElement === parent) return;
      // Moving an element out of the document hides its open popovers.
      parent.appendChild(host);
      host.querySelectorAll<HTMLElement>('[popover]').forEach(el => {
        const popover = el as PopoverElement;
        if (!el.matches(':popover-open')) popover.showPopover?.();
      });
    };

    const observer = new MutationObserver(records => {
      for (const r of records) {
        const el = r.target;
        if (r.type !== 'attributes' || !(el instanceof HTMLDialogElement)) continue;
        const i = stack.indexOf(el);
        if (i !== -1) stack.splice(i, 1);
        if (isModalDialog(el)) stack.push(el);
      }
      sync();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['open'], subtree: true });
    // Dialogs (AKDS's included) are portaled to <body>; catch one being
    // unmounted while open, which removes it without an `open` change.
    observer.observe(document.body, { childList: true });
    sync();

    return () => {
      observer.disconnect();
      // Leave a still-mounted host in <body>; never re-attach a removed one.
      if (host.isConnected && host.parentElement !== document.body) document.body.appendChild(host);
    };
  }, [host]);
}

type AriaNotifyDocument = Document & {
  ariaNotify?: (announcement: string, options?: { priority?: 'normal' | 'high' }) => void;
};

const EMPHASIS_ICON: Record<ToastEmphasis, React.ReactNode> = {
  accented: <InfoFilledIcon />,
  neutral: null,
  success: <CheckCircleFilledIcon />,
  destructive: <ErrorFilledIcon />,
};

interface ToastRecord {
  id: string;
  message: React.ReactNode;
  emphasis: ToastEmphasis;
  placement: ToastPlacement;
  autoDismiss: boolean;
  duration: number;
  icon?: React.ReactNode;
  closing: boolean;
}

interface ToastCardProps {
  toast: ToastRecord;
  offset: number;
  registerNode: (node: HTMLDivElement | null) => void;
  onDismiss: () => void;
  onExited: () => void;
  announce: (text: string, assertive: boolean) => void;
}

function ToastCard({ toast, offset, registerNode, onDismiss, onExited, announce }: ToastCardProps) {
  const { message, emphasis, autoDismiss, duration, closing } = toast;
  const icon = toast.icon !== undefined ? toast.icon : EMPHASIS_ICON[emphasis];
  const messageRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // A live region only reliably announces a *change* to its content —
    // this card (and its role/aria-live) is created fully-formed with the
    // message already inside it, which VoiceOver and other screen readers
    // often don't announce on first paint. Route the text through a
    // persistent, always-mounted live region instead (see ToastProvider).
    // Only the toast's visible message is announced — not the close button's
    // name. If the message contains its own controls, say so.
    const el = messageRef.current;
    const text = el?.textContent?.trim() ?? '';
    const hasActions = !!el?.querySelector(FOCUSABLE);
    announce(hasActions && text ? `${text}. Actions available` : text, emphasis === 'destructive');
    // Announce once, on mount, regardless of later prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Icon/message/close center-align nicely against a single line of text,
  // but look off-balance pinned to the vertical center once the message
  // wraps — so switch to top alignment as soon as it takes more than one
  // line. useLayoutEffect (not useEffect) so the class is correct before
  // the first paint, and a ResizeObserver keeps it correct if the viewport
  // is resized while the toast is still visible.
  const [singleLine, setSingleLine] = React.useState(true);

  React.useLayoutEffect(() => {
    const el = messageRef.current;
    if (!el) return;

    const checkWrap = () => {
      const range = document.createRange();
      range.selectNodeContents(el);
      setSingleLine(range.getClientRects().length <= 1);
    };

    checkWrap();

    const observer = new ResizeObserver(checkWrap);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const startedAtRef = React.useRef(0);
  const remainingRef = React.useRef(duration);
  // The viewport passes a new onDismiss closure on every render (e.g. each
  // time another toast is shown). Read it through a ref so a re-render never
  // restarts the auto-dismiss countdown.
  const onDismissRef = React.useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const clearTimer = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const startTimer = React.useCallback((ms: number) => {
    clearTimer();
    startedAtRef.current = Date.now();
    timeoutRef.current = setTimeout(() => onDismissRef.current(), ms);
  }, [clearTimer]);

  React.useEffect(() => {
    if (!autoDismiss) return;
    remainingRef.current = duration;
    startTimer(duration);
    return clearTimer;
  }, [autoDismiss, duration, startTimer, clearTimer]);

  const handlePause = () => {
    if (!autoDismiss || closing) return;
    clearTimer();
    remainingRef.current -= Date.now() - startedAtRef.current;
  };

  const handleResume = () => {
    if (!autoDismiss || closing) return;
    startTimer(Math.max(remainingRef.current, 0));
  };

  return (
    <div
      className={withBaseName.el('item')}
      style={{ '--akds-toast-offset': `${offset}px` } as React.CSSProperties}
    >
      {/* No role/aria-live here: announcements go through ariaNotify() or the
          provider's persistent live regions only, so they're never doubled. */}
      <div
        ref={registerNode}
        className={clsx(
          withBaseName(),
          withBaseName(emphasis),
          { [withBaseName('closing')]: closing, [withBaseName('single-line')]: singleLine },
        )}
        onAnimationEnd={() => { if (closing) onExited(); }}
        onPointerEnter={handlePause}
        onPointerLeave={handleResume}
        onFocus={handlePause}
        onBlur={handleResume}
      >
        {icon && <span className={withBaseName.el('icon')} aria-hidden="true">{icon}</span>}
        <div ref={messageRef} className={withBaseName.el('message')}>{message}</div>
        <IconButton
          className={withBaseName.el('close')}
          appearance="transparent"
          emphasis="neutral"
          aria-label="Dismiss notification"
          onClick={onDismiss}
        >
          <CloseIcon size="sm" />
        </IconButton>
      </div>
    </div>
  );
}

interface ToastViewportProps {
  placement: ToastPlacement;
  toasts: ToastRecord[];
  onDismiss: (id: string) => void;
  onExited: (id: string) => void;
  announce: (text: string, assertive: boolean) => void;
  registerToast: (id: string, node: HTMLDivElement | null) => void;
  onRegionFocus: (event: React.FocusEvent<HTMLDivElement>) => void;
}

function ToastViewport({ placement, toasts, onDismiss, onExited, announce, registerToast, onRegionFocus }: ToastViewportProps) {
  const nodesRef = React.useRef<Map<string, HTMLDivElement>>(new Map());
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const hasToasts = toasts.length > 0;

  // popover="manual" promotes the viewport into the top layer, so toasts sit
  // above other top-layer content (dialogs, popovers) opened before them and
  // aren't light-dismissed. Browsers without the Popover API fall back to the
  // fixed-position z-index stacking in Toast.css.
  React.useLayoutEffect(() => {
    const el = viewportRef.current as PopoverElement | null;
    if (!hasToasts || !el || !popoverSupported() || typeof el.showPopover !== 'function') return;
    // setAttribute (not the IDL property) so SSR markup matches and browsers
    // without the Popover API never hide the region behind a UA [popover] rule.
    el.setAttribute('popover', 'manual');
    try {
      if (!el.matches(':popover-open')) el.showPopover();
    } catch {
      // Not connected / already showing — nothing to do.
    }
  }, [hasToasts]);
  const [heights, setHeights] = React.useState<Map<string, number>>(new Map());

  React.useLayoutEffect(() => {
    const next = new Map<string, number>();
    let changed = false;
    for (const t of toasts) {
      const height = nodesRef.current.get(t.id)?.getBoundingClientRect().height ?? 0;
      next.set(t.id, height);
      if (heights.get(t.id) !== height) changed = true;
    }
    if (changed || next.size !== heights.size) setHeights(next);
    // Only re-measure when the set of rendered toasts changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toasts]);

  const offsetById = new Map<string, number>();
  let cumulative = 0;
  for (let i = toasts.length - 1; i >= 0; i -= 1) {
    const t = toasts[i]!;
    offsetById.set(t.id, cumulative);
    cumulative += (heights.get(t.id) ?? 0) + STACK_GAP;
  }

  if (!hasToasts) return null;

  return (
    <div
      ref={viewportRef}
      className={clsx(withBaseName.el('viewport'), withBaseName.el('viewport') + `--${placement}`)}
      role="region"
      aria-label="Notifications"
      onFocus={onRegionFocus}
    >
      {toasts.map(t => (
        <ToastCard
          key={t.id}
          toast={t}
          offset={offsetById.get(t.id) ?? 0}
          registerNode={node => {
            if (node) nodesRef.current.set(t.id, node);
            else nodesRef.current.delete(t.id);
            registerToast(t.id, node);
          }}
          onDismiss={() => onDismiss(t.id)}
          onExited={() => onExited(t.id)}
          announce={announce}
        />
      ))}
    </div>
  );
}

let nextToastId = 0;

export const ToastProvider: React.FC<ToastProviderProps> = ({
  placement = 'bottom-right',
  autoDismiss = true,
  duration = 7000,
  children,
}) => {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const toastsRef = React.useRef(toasts);
  toastsRef.current = toasts;
  const toastNodesRef = React.useRef<Map<string, HTMLDivElement>>(new Map());
  // Where focus was before the user moved into the notifications region, and
  // the element focused when each toast was shown — used to restore focus
  // when the last focused toast is dismissed.
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const triggerByIdRef = React.useRef<Map<string, HTMLElement>>(new Map());

  const registerToast = React.useCallback((id: string, node: HTMLDivElement | null) => {
    if (node) toastNodesRef.current.set(id, node);
    else toastNodesRef.current.delete(id);
  }, []);

  const isInToast = (el: Element | null) => {
    if (!el) return false;
    for (const node of toastNodesRef.current.values()) if (node.contains(el)) return true;
    return false;
  };

  const handleRegionFocus = React.useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    const from = event.relatedTarget as HTMLElement | null;
    if (from && !isInToast(from)) returnFocusRef.current = from;
    // isInToast only reads refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the toast being dismissed holds focus, move focus to the next remaining
  // toast, or — when none remain — back to where the user was before, so it
  // never drops to <body>.
  const moveFocusFrom = (id: string) => {
    const node = toastNodesRef.current.get(id);
    const active = document.activeElement;
    if (!node || !active || !node.contains(active)) return;

    const open = toastsRef.current.filter(t => !t.closing && t.id !== id);
    const index = toastsRef.current.findIndex(t => t.id === id);
    const next = open.find(t => toastsRef.current.indexOf(t) > index) ?? open[open.length - 1];
    const nextTarget = next && toastNodesRef.current.get(next.id)?.querySelector<HTMLElement>(FOCUSABLE);
    if (nextTarget) {
      nextTarget.focus();
      return;
    }

    const candidates = [returnFocusRef.current, triggerByIdRef.current.get(id)];
    const target = candidates.find(el => el && el.isConnected && !isInToast(el));
    target?.focus();
  };

  const dismiss = React.useCallback((id: string) => {
    moveFocusFrom(id);
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, closing: true } : t)));
    // moveFocusFrom only reads refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = React.useCallback((id: string) => {
    triggerByIdRef.current.delete(id);
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Announcements use document.ariaNotify() where supported. Otherwise they
  // fall back to these two live regions, which stay mounted for the
  // provider's lifetime — a live region only reliably announces a *change*,
  // so clearing then setting their text is what triggers the announcement.
  // Toast cards themselves carry no live semantics, so nothing is announced twice.
  const politeRef = React.useRef<HTMLDivElement>(null);
  const assertiveRef = React.useRef<HTMLDivElement>(null);

  // Toasts and the live regions render into a host element appended to
  // <body>, which useModalHost moves into an open modal dialog so they stay
  // above it and remain interactive (and audible — inert live regions are not
  // announced). Created in an effect so server and client markup match.
  const [host, setHost] = React.useState<HTMLElement | null>(null);
  React.useLayoutEffect(() => {
    const el = document.createElement('div');
    el.className = withBaseName.el('host');
    document.body.appendChild(el);
    setHost(el);
    return () => el.remove();
  }, []);
  useModalHost(host);

  const announce = React.useCallback((text: string, assertive: boolean) => {
    if (!text) return;
    const doc = document as AriaNotifyDocument;
    if (typeof doc.ariaNotify === 'function') {
      doc.ariaNotify(text, { priority: assertive ? 'high' : 'normal' });
      return;
    }
    const el = assertive ? assertiveRef.current : politeRef.current;
    if (!el) return;
    el.textContent = '';
    window.setTimeout(() => { if (el) el.textContent = text; }, 100);
  }, []);

  const show = React.useCallback((options: ToastOptions) => {
    const id = `akds-toast-${(nextToastId += 1)}`;
    const active = typeof document !== 'undefined' ? document.activeElement : null;
    if (active instanceof HTMLElement && active !== document.body) triggerByIdRef.current.set(id, active);
    setToasts(prev => [
      ...prev,
      {
        id,
        message: options.message,
        emphasis: options.emphasis ?? 'neutral',
        placement: options.placement ?? placement,
        autoDismiss: options.autoDismiss ?? autoDismiss,
        duration: options.duration ?? duration,
        icon: options.icon,
        closing: false,
      },
    ]);
    return id;
  }, [placement, autoDismiss, duration]);

  const contextValue = React.useMemo(() => ({ show, dismiss }), [show, dismiss]);

  const groups = React.useMemo(() => {
    const map = new Map<ToastPlacement, ToastRecord[]>();
    for (const t of toasts) {
      const list = map.get(t.placement) ?? [];
      list.push(t);
      map.set(t.placement, list);
    }
    return map;
  }, [toasts]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {host && ReactDOM.createPortal(
        <>
          <div ref={politeRef} className={withBaseName.el('announcer')} aria-live="polite" aria-atomic="true" />
          <div ref={assertiveRef} className={withBaseName.el('announcer')} aria-live="assertive" aria-atomic="true" />
          {Array.from(groups.entries()).map(([groupPlacement, groupToasts]) => (
            <ToastViewport
              key={groupPlacement}
              placement={groupPlacement}
              toasts={groupToasts}
              onDismiss={dismiss}
              onExited={remove}
              announce={announce}
              registerToast={registerToast}
              onRegionFocus={handleRegionFocus}
            />
          ))}
        </>,
        host,
      )}
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';
