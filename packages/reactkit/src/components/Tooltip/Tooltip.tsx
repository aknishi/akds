import React from 'react';
import clsx from 'clsx';
import './Tooltip.css';
import type { TooltipProps, TooltipPlacement } from './Tooltip.types';
import { makePrefixer } from '../../utils/makePrefixer';

const withBaseName = makePrefixer('akds-tooltip');

const HIDE_DURATION = 160;
// Grace period after the pointer leaves the trigger (or tooltip) so it can
// cross the gap onto the tooltip without it closing — WCAG 1.4.13 "hoverable".
const HOVER_GRACE = 100;
// Mirrors --akds-spacing-100 — the gap between trigger and tooltip.
const GAP = 8;

type PopoverElement = HTMLElement & {
  showPopover?: () => void;
  hidePopover?: () => void;
};

// Feature-detect the Popover API on the prototype (not via the IDL attribute).
function popoverSupported(): boolean {
  return typeof HTMLElement !== 'undefined' && Object.prototype.hasOwnProperty.call(HTMLElement.prototype, 'popover');
}

function supportsPopover(el: PopoverElement | null): el is PopoverElement & Required<Pick<PopoverElement, 'showPopover' | 'hidePopover'>> {
  return !!el && typeof el.showPopover === 'function' && typeof el.hidePopover === 'function';
}

function isPopoverOpen(el: HTMLElement): boolean {
  try {
    return el.matches(':popover-open');
  } catch {
    return false;
  }
}

function supportsAnchorPositioning(): boolean {
  return typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('position-area: block-start');
}

/**
 * Fallback for browsers without CSS anchor positioning: places the tooltip
 * (position: fixed, see Tooltip.css) next to the trigger, flipping to the
 * opposite side when it would overflow the viewport and clamping it inside.
 */
function positionFallback(tooltip: HTMLElement, anchor: HTMLElement, placement: TooltipPlacement) {
  const a = anchor.getBoundingClientRect();
  const t = tooltip.getBoundingClientRect();
  const vw = document.documentElement.clientWidth || window.innerWidth;
  const vh = document.documentElement.clientHeight || window.innerHeight;

  let side = placement;
  if (side === 'top' && a.top - GAP - t.height < 0) side = 'bottom';
  else if (side === 'bottom' && a.bottom + GAP + t.height > vh) side = 'top';
  else if (side === 'left' && a.left - GAP - t.width < 0) side = 'right';
  else if (side === 'right' && a.right + GAP + t.width > vw) side = 'left';

  let top: number;
  let left: number;
  if (side === 'top' || side === 'bottom') {
    top = side === 'top' ? a.top - GAP - t.height : a.bottom + GAP;
    left = a.left + a.width / 2 - t.width / 2;
  } else {
    left = side === 'left' ? a.left - GAP - t.width : a.right + GAP;
    top = a.top + a.height / 2 - t.height / 2;
  }

  left = Math.min(Math.max(left, GAP), Math.max(vw - t.width - GAP, GAP));
  top = Math.min(Math.max(top, GAP), Math.max(vh - t.height - GAP, GAP));

  tooltip.style.setProperty('--akds-tooltip-top', `${top}px`);
  tooltip.style.setProperty('--akds-tooltip-left', `${left}px`);
}

export const Tooltip: React.FC<TooltipProps> = function Tooltip({
  content,
  children,
  placement = 'top',
  open,
  onOpenChange,
}) {
  const isControlled = open !== undefined;
  const [internalVisible, setInternalVisible] = React.useState(false);
  const [hiding, setHiding] = React.useState(false);
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const graceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasVisibleRef = React.useRef(false);
  const focusedRef = React.useRef(false);
  const tooltipRef = React.useRef<HTMLSpanElement>(null);
  const wrapperRef = React.useRef<HTMLSpanElement>(null);
  const tooltipId = React.useId();
  // popover="hint" (set in an effect below) light-dismisses without closing
  // unrelated auto/manual popovers. Browsers without "hint" treat it as
  // "manual"; the hover/focus/Escape handling here closes it on loss of interest.
  // useId returns ":r0:"-style ids — colons aren't valid in a CSS dashed ident.
  const anchorName = `--akds-tooltip-${tooltipId.replace(/:/g, '')}`;

  const child = React.Children.only(children);
  const childProps = child.props as React.HTMLAttributes<HTMLElement>;
  const visible = open ?? internalVisible;
  const visibleRef = React.useRef(visible);
  visibleRef.current = visible;

  const clearGrace = () => {
    if (graceTimerRef.current) {
      clearTimeout(graceTimerRef.current);
      graceTimerRef.current = null;
    }
  };

  const show = () => {
    clearGrace();
    if (!isControlled) setInternalVisible(true);
    onOpenChange?.(true);
  };

  const hide = () => {
    clearGrace();
    if (!isControlled) setInternalVisible(false);
    onOpenChange?.(false);
  };

  // Keep latest callbacks reachable from long-lived DOM listeners.
  const hideRef = React.useRef(hide);
  hideRef.current = hide;

  const scheduleHide = () => {
    clearGrace();
    graceTimerRef.current = setTimeout(() => {
      graceTimerRef.current = null;
      // Keyboard focus is still a reason to show it — only the hover ended.
      if (!focusedRef.current) hideRef.current();
    }, HOVER_GRACE);
  };

  // Opt into the top layer only where the Popover API exists. Set with
  // setAttribute after mount so SSR markup matches and browsers without
  // support keep the plain fixed-position fallback.
  React.useLayoutEffect(() => {
    if (popoverSupported()) tooltipRef.current?.setAttribute('popover', 'hint');
  }, []);

  // Drives the hiding grace-period animation off visibility transitions, rather than
  // from the event handlers directly, so controlled and uncontrolled usage animate the same way.
  // The popover stays in the top layer while the exit transition runs (the
  // "data-closing then hidePopover" fallback), and is hidden once it finishes.
  React.useLayoutEffect(() => {
    const el = tooltipRef.current;
    if (visible) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setHiding(false);
      wasVisibleRef.current = true;
      if (supportsPopover(el) && !isPopoverOpen(el)) {
        try {
          el.showPopover();
        } catch {
          // Element disconnected or already open in another state — ignore.
        }
      }
    } else if (wasVisibleRef.current) {
      wasVisibleRef.current = false;
      setHiding(true);
      hideTimerRef.current = setTimeout(() => {
        setHiding(false);
        hideTimerRef.current = null;
        if (supportsPopover(el) && isPopoverOpen(el)) el.hidePopover();
      }, HIDE_DURATION);
    }
  }, [visible]);

  // Anchor-positioning fallback: compute coordinates in JS while open.
  React.useLayoutEffect(() => {
    if (!visible || supportsAnchorPositioning()) return undefined;
    const el = tooltipRef.current;
    const anchor = wrapperRef.current;
    if (!el || !anchor) return undefined;
    const update = () => positionFallback(el, anchor, placement);
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [visible, placement]);

  // Escape dismisses the tooltip without moving hover or focus (WCAG 1.4.13).
  // Native popover="hint" also closes on Escape / light dismiss; the toggle
  // listener below keeps React state in sync with that.
  React.useEffect(() => {
    if (!visible) return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visibleRef.current) {
        // Consume Escape like native popover="hint" does, so a surrounding
        // native <dialog> stays open while only the tooltip is dismissed.
        e.preventDefault();
        hideRef.current();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [visible]);

  React.useEffect(() => {
    const el = tooltipRef.current;
    if (!el) return undefined;
    const onToggle = (e: Event) => {
      const newState = (e as Event & { newState?: string }).newState;
      if (newState === 'closed' && visibleRef.current) hideRef.current();
    };
    el.addEventListener('toggle', onToggle);
    return () => el.removeEventListener('toggle', onToggle);
  }, []);

  React.useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
    };
  }, []);

  const handleMouseEnter = (e: React.MouseEvent) => {
    show();
    childProps.onMouseEnter?.(e as React.MouseEvent<HTMLElement>);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    scheduleHide();
    childProps.onMouseLeave?.(e as React.MouseEvent<HTMLElement>);
  };

  const handleFocus = (e: React.FocusEvent) => {
    focusedRef.current = true;
    show();
    childProps.onFocus?.(e as React.FocusEvent<HTMLElement>);
  };

  const handleBlur = (e: React.FocusEvent) => {
    focusedRef.current = false;
    hide();
    childProps.onBlur?.(e as React.FocusEvent<HTMLElement>);
  };

  // Merge with any aria-describedby the child already has instead of replacing it.
  const describedBy = [childProps['aria-describedby'], tooltipId].filter(Boolean).join(' ');

  const clonedChild = React.cloneElement(child, {
    'aria-describedby': describedBy,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <span
      ref={wrapperRef}
      className={withBaseName.el('wrapper')}
      style={{ '--akds-tooltip-anchor': anchorName } as React.CSSProperties}
    >
      {clonedChild}
      <span
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        className={clsx(
          withBaseName(),
          withBaseName(placement),
          { [withBaseName('visible')]: visible },
          { [withBaseName('hiding')]: hiding },
        )}
        aria-hidden={!visible && !hiding || undefined}
        onMouseEnter={clearGrace}
        onMouseLeave={scheduleHide}
      >
        {content}
      </span>
    </span>
  );
};

Tooltip.displayName = 'Tooltip';
