import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import './Drawer.css';
import type { DrawerProps, DrawerSide } from './Drawer.types';
import { CloseIcon } from '@aknishi/akds-icons';
import { IconButton } from '../IconButton';
import { makePrefixer, useModalDialog } from '../../utils';

const withBaseName = makePrefixer('akds-drawer');

// IntersectionObserver thresholds: below HIDDEN the sheet counts as fully
// swiped away; at or above SHOWN it counts as fully open (0.99 rather than 1
// so sub-pixel snap offsets still register).
const HIDDEN = 0.001;
const SHOWN = 0.99;
// Safety net so a slide-out the user interrupts (or that never scrolls) can't
// keep the dialog open.
const EXIT_TIMEOUT = 1000;

const supports = (condition: string) =>
  typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports(condition);

/** Scroll geometry for a side: the sheet sits at the edge, the spacer away from it. */
function geometry(scroller: HTMLElement, side: DrawerSide) {
  const vertical = side === 'top' || side === 'bottom';
  // Right / bottom put the spacer first, so scroll 0 is the closed stop.
  const closedAtStart = side === 'right' || side === 'bottom';
  const range = vertical
    ? scroller.scrollHeight - scroller.clientHeight
    : scroller.scrollWidth - scroller.clientWidth;
  const position = vertical ? scroller.scrollTop : scroller.scrollLeft;
  return {
    vertical,
    range,
    position,
    open: closedAtStart ? range : 0,
    closed: closedAtStart ? 0 : range,
    // 1 = fully open, 0 = fully closed.
    progress: range > 0 ? (closedAtStart ? position / range : 1 - position / range) : 1,
  };
}

function scrollToStop(
  scroller: HTMLElement,
  side: DrawerSide,
  stop: 'open' | 'closed',
  // 'auto' defers to the CSS scroll-behavior: smooth unless reduced motion.
  behavior: 'auto' | 'instant' = 'auto',
) {
  const g = geometry(scroller, side);
  const options = (g.vertical ? { top: g[stop] } : { left: g[stop] }) as ScrollToOptions;
  options.behavior = behavior as ScrollBehavior;
  scroller.scrollTo?.(options);
}

/**
 * A native modal `<dialog>` that fills the viewport and holds a scroll-snap
 * container with two stops: the sheet (open) and an empty spacer (closed).
 * Opening scrolls to the sheet, closing scrolls to the spacer, and the user can
 * swipe between them natively. An IntersectionObserver reports when the sheet
 * has fully left, which is when a swipe asks the parent to close and when a
 * parent-driven close finally calls `dialog.close()`. The browser provides the
 * top layer, `::backdrop`, inert page, focus containment and focus return.
 */
export const Drawer = React.forwardRef<HTMLDialogElement, DrawerProps>(
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
      'aria-label': ariaLabel,
    },
    ref,
  ) {
    // Snapshot the last valid side so the close animation uses the correct
    // direction even when `side` is set to null at the same time as `open=false`.
    const lastSideRef = React.useRef<DrawerSide>(side ?? 'right');
    if (side) lastSideRef.current = side;
    const effectiveSide = lastSideRef.current;

    const scrollerRef = React.useRef<HTMLDivElement>(null);
    const sheetRef = React.useRef<HTMLDivElement>(null);
    const openRef = React.useRef(open);
    const onCloseRef = React.useRef(onClose);
    React.useLayoutEffect(() => {
      openRef.current = open;
      onCloseRef.current = onClose;
    });

    // Sheet state as last observed.
    const hiddenRef = React.useRef(false);
    // The sheet has been fully open since the last show / dismissal, so a
    // later "fully hidden" report is a swipe-out (not the pre-open position).
    const openedRef = React.useRef(false);
    // onClose already requested for the current swipe-out.
    const dismissedRef = React.useRef(false);
    // The user has touched / wheeled / keyed the scroller since showing.
    const interactedRef = React.useRef(false);
    // An instant jump to the closed stop is in flight (opening fallback).
    const jumpingRef = React.useRef(false);
    // dialog.showModal() has run for the current mount.
    const shownRef = React.useRef(false);
    // Resolves the pending parent-driven slide-out.
    const exitDoneRef = React.useRef<(() => void) | null>(null);
    // Bumped on every swipe-out so a layout effect can snap back open if the
    // parent keeps `open` true.
    const [swipeDismissals, setSwipeDismissals] = React.useState(0);

    const exit = React.useCallback(
      () =>
        new Promise<void>((resolve) => {
          const scroller = scrollerRef.current;
          if (!scroller || hiddenRef.current || geometry(scroller, lastSideRef.current).range <= 0) {
            resolve();
            return;
          }
          const done = () => {
            clearTimeout(timer);
            if (exitDoneRef.current === done) exitDoneRef.current = null;
            resolve();
          };
          const timer = setTimeout(done, EXIT_TIMEOUT);
          exitDoneRef.current = done;
          scrollToStop(scroller, lastSideRef.current, 'closed');
        }),
      [],
    );

    const titleId = React.useId();
    const { dialogRef, mounted, dialogProps } = useModalDialog({
      open,
      onClose,
      // The dialog fills the viewport, so backdrop taps land inside it and are
      // handled below rather than by closedby="any" (which would also skip the
      // slide-out).
      lightDismiss: false,
      exit,
    });

    React.useImperativeHandle(ref, () => dialogRef.current!, [mounted]);

    // Runs after the hook's layout effect, i.e. after showModal().
    React.useLayoutEffect(() => {
      if (!mounted) {
        shownRef.current = false;
        return;
      }
      const dialog = dialogRef.current;
      const scroller = scrollerRef.current;
      if (!open || !dialog?.open || !scroller) return;

      // Reopened mid-exit: drop the pending slide-out and slide back in.
      exitDoneRef.current = null;
      if (shownRef.current) {
        scrollToStop(scroller, lastSideRef.current, 'open');
        return;
      }

      shownRef.current = true;
      openedRef.current = false;
      dismissedRef.current = false;
      interactedRef.current = false;
      hiddenRef.current = false;

      // `scroll-initial-target` already placed the scroller at the closed stop
      // (and nothing, e.g. initial focus, moved it): just slide in.
      const g = geometry(scroller, lastSideRef.current);
      if (supports('scroll-initial-target: nearest') && g.range > 0 && Math.abs(g.position - g.closed) < 1) {
        scrollToStop(scroller, lastSideRef.current, 'open');
        return;
      }

      // Otherwise jump to the closed stop first and wait two frames for the
      // jump to commit; a single frame lets the next scrollTo cancel it.
      jumpingRef.current = true;
      scrollToStop(scroller, lastSideRef.current, 'closed', 'instant');
      let frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          jumpingRef.current = false;
          if (openRef.current) scrollToStop(scroller, lastSideRef.current, 'open');
        });
      });
      return () => {
        cancelAnimationFrame(frame);
        jumpingRef.current = false;
      };
    }, [open, mounted]);

    // A swipe-out asked the parent to close; if it kept the drawer open, snap back.
    React.useLayoutEffect(() => {
      const scroller = scrollerRef.current;
      if (swipeDismissals === 0 || !open || !scroller || !dialogRef.current?.open) return;
      dismissedRef.current = false;
      scrollToStop(scroller, lastSideRef.current, 'open');
    }, [swipeDismissals]);

    // Observe the sheet, sync the backdrop fallback, and detect swipe-outs.
    React.useEffect(() => {
      const dialog = dialogRef.current;
      const scroller = scrollerRef.current;
      const sheet = sheetRef.current;
      if (!dialog || !scroller || !sheet) return;

      const onHidden = (settled: boolean) => {
        hiddenRef.current = true;
        // A parent-driven close finished sliding out.
        if (exitDoneRef.current) {
          exitDoneRef.current();
          return;
        }
        if (!openRef.current || !dialog.open || dismissedRef.current) return;
        // The "hidden" report before the opening slide-in is not a swipe, but
        // a user flicking the sheet away mid-open (settled at the closed stop
        // after interacting) is.
        if (!openedRef.current && !(settled && interactedRef.current)) return;
        openedRef.current = false;
        dismissedRef.current = true;
        onCloseRef.current();
        setSwipeDismissals((n) => n + 1);
      };

      let observer: IntersectionObserver | undefined;
      if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(
          (entries) => {
            // Only the latest entry describes the current position.
            const entry = entries[entries.length - 1];
            if (!entry) return;
            if (entry.intersectionRatio < HIDDEN) {
              onHidden(false);
            } else {
              hiddenRef.current = false;
              if (entry.intersectionRatio >= SHOWN) {
                openedRef.current = true;
                dismissedRef.current = false;
              }
            }
          },
          { root: dialog, threshold: [HIDDEN, SHOWN] },
        );
        observer.observe(sheet);
      }

      const onScrollEnd = () => {
        if (jumpingRef.current) return;
        const g = geometry(scroller, lastSideRef.current);
        if (g.range > 0 && Math.abs(g.position - g.closed) < 1) onHidden(true);
      };
      const onInteract = () => {
        interactedRef.current = true;
      };

      // Backdrop fade fallback where scroll-driven animations are unsupported:
      // the @supports-gated keyframes never apply, so this is the only writer.
      const syncBackdrop = () => {
        const g = geometry(scroller, lastSideRef.current);
        dialog.style.setProperty('--akds-drawer-backdrop', String(g.progress));
      };
      const needsBackdropFallback = !supports('animation-timeline: scroll()');

      scroller.addEventListener('scrollend', onScrollEnd);
      scroller.addEventListener('pointerdown', onInteract);
      scroller.addEventListener('wheel', onInteract, { passive: true });
      scroller.addEventListener('keydown', onInteract);
      if (needsBackdropFallback) {
        dialog.style.setProperty('--akds-drawer-backdrop', '0');
        scroller.addEventListener('scroll', syncBackdrop, { passive: true });
      }
      return () => {
        observer?.disconnect();
        scroller.removeEventListener('scrollend', onScrollEnd);
        scroller.removeEventListener('pointerdown', onInteract);
        scroller.removeEventListener('wheel', onInteract);
        scroller.removeEventListener('keydown', onInteract);
        if (needsBackdropFallback) scroller.removeEventListener('scroll', syncBackdrop);
      };
    }, [mounted]);

    // Backdrop tap: a press and release inside the dialog but outside the
    // sheet. Requiring both ends outside keeps a text-selection drag that ends
    // on the backdrop from dismissing.
    const pressedOutsideRef = React.useRef(false);
    // Only the transparent layers count as backdrop: the dialog itself and the
    // scroller (whose ::after spacer is the closed snap stop). Anything else
    // inside the dialog that isn't the sheet — e.g. toasts the ToastProvider
    // moves into an open modal — is not a backdrop tap.
    const isOutsideSheet = (target: EventTarget | null) =>
      target === dialogRef.current || target === scrollerRef.current;
    const handlePointerDown = (e: React.PointerEvent) => {
      pressedOutsideRef.current = isOutsideSheet(e.target);
    };
    const handleClick = (e: React.MouseEvent) => {
      const pressedOutside = pressedOutsideRef.current;
      pressedOutsideRef.current = false;
      if (disableBackdropClose || !pressedOutside || !isOutsideSheet(e.target)) return;
      onClose();
    };

    if (!mounted) return null;

    return ReactDOM.createPortal(
      // Key / pointer handling lives on the sheet's controls; the dialog's
      // click handler only catches taps on the transparent backdrop area.
      <dialog
        ref={dialogRef}
        {...dialogProps}
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        className={clsx(
          withBaseName(),
          withBaseName(effectiveSide),
          withBaseName(size),
          className,
        )}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        <div ref={scrollerRef} className={withBaseName.el('scroller')}>
          <div ref={sheetRef} className={withBaseName.el('sheet')}>
            <div className={withBaseName.el('header')}>
              {title && (
                <h2 id={titleId} className={withBaseName.el('title')}>{title}</h2>
              )}
              <IconButton
                className={withBaseName.el('close')}
                appearance="transparent"
                emphasis="neutral"
                onClick={onClose}
                aria-label="Close drawer"
              >
                <CloseIcon />
              </IconButton>
            </div>
            <div className={withBaseName.el('body')}>{children}</div>
          </div>
        </div>
      </dialog>,
      document.body,
    );
  },
);

Drawer.displayName = 'Drawer';
