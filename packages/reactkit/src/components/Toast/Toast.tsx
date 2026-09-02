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
    announce(messageRef.current?.textContent ?? '', emphasis === 'destructive');
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

  const clearTimer = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const startTimer = React.useCallback((ms: number) => {
    clearTimer();
    startedAtRef.current = Date.now();
    timeoutRef.current = setTimeout(onDismiss, ms);
  }, [clearTimer, onDismiss]);

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
      <div
        ref={registerNode}
        role={emphasis === 'destructive' ? 'alert' : 'status'}
        aria-live={emphasis === 'destructive' ? 'assertive' : 'polite'}
        aria-atomic="true"
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
}

function ToastViewport({ placement, toasts, onDismiss, onExited, announce }: ToastViewportProps) {
  const nodesRef = React.useRef<Map<string, HTMLDivElement>>(new Map());
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

  if (toasts.length === 0) return null;

  return (
    <div
      className={clsx(withBaseName.el('viewport'), withBaseName.el('viewport') + `--${placement}`)}
      role="region"
      aria-label="Notifications"
    >
      {toasts.map(t => (
        <ToastCard
          key={t.id}
          toast={t}
          offset={offsetById.get(t.id) ?? 0}
          registerNode={node => {
            if (node) nodesRef.current.set(t.id, node);
            else nodesRef.current.delete(t.id);
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

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, closing: true } : t)));
  }, []);

  const remove = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Toast cards are created fully-formed — role/aria-live and content commit
  // in the same paint — which VoiceOver (and other screen readers) often
  // don't pick up, since a live region only reliably announces a *change*.
  // These two regions stay mounted for the provider's lifetime; clearing
  // then setting their text is what actually triggers the announcement.
  const politeRef = React.useRef<HTMLDivElement>(null);
  const assertiveRef = React.useRef<HTMLDivElement>(null);

  const announce = React.useCallback((text: string, assertive: boolean) => {
    const el = assertive ? assertiveRef.current : politeRef.current;
    if (!el || !text) return;
    el.textContent = '';
    window.setTimeout(() => { if (el) el.textContent = text; }, 100);
  }, []);

  const show = React.useCallback((options: ToastOptions) => {
    const id = `akds-toast-${(nextToastId += 1)}`;
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
      <div ref={politeRef} className={withBaseName.el('announcer')} aria-live="polite" aria-atomic="true" />
      <div ref={assertiveRef} className={withBaseName.el('announcer')} aria-live="assertive" aria-atomic="true" />
      {typeof document !== 'undefined' && Array.from(groups.entries()).map(([groupPlacement, groupToasts]) =>
        ReactDOM.createPortal(
          <ToastViewport
            key={groupPlacement}
            placement={groupPlacement}
            toasts={groupToasts}
            onDismiss={dismiss}
            onExited={remove}
            announce={announce}
          />,
          document.body,
        ),
      )}
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';
