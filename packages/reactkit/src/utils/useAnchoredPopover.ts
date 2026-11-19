import React from 'react';

/**
 * Shared popup-layer plumbing for Menu, DropdownMenu and Combobox.
 *
 * Native path (Popover API): the popup is rendered in place with a `popover`
 * attribute and promoted to the top layer with `showPopover()`, so it is never
 * clipped by `overflow` ancestors or trapped under a modal `<dialog>`. CSS
 * anchor positioning (gated behind `@supports (position-area: block-end)` in
 * Menu.css) tethers it to its anchor and flips it when it would overflow.
 *
 * Fallbacks:
 * - Popover supported, anchor positioning not (e.g. Firefox): `calcPosition`
 *   places the popup with fixed coordinates from script.
 * - Popover not supported: the caller's legacy layout is kept (`legacyPositioning`):
 *   'js' → fixed coordinates from `calcPosition`, 'css' → the component's own
 *   absolute positioning. Outside-click / Escape handling stays in the caller.
 * - Exit transitions need `overlay` + discrete `display` transitions; where those
 *   are missing, `data-closing` drives the exit and the popup is hidden once its
 *   animations settle.
 */

export type PopoverPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const GAP = 4;
const EXIT_TIMEOUT_MS = 400;

export function supportsPopover(): boolean {
  return (
    typeof HTMLElement !== 'undefined' &&
    Object.prototype.hasOwnProperty.call(HTMLElement.prototype, 'popover') &&
    typeof (HTMLElement.prototype as Partial<HTMLElement>).showPopover === 'function'
  );
}

function cssSupports(property: string, value: string): boolean {
  return typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports(property, value);
}

export function supportsAnchorPositioning(): boolean {
  return cssSupports('position-area', 'block-end');
}

let displayTransitionSupport: boolean | undefined;

/**
 * Firefox parses `transition-behavior: allow-discrete` without transitioning
 * `display`, so probe the real behaviour instead of trusting CSS.supports.
 */
function canTransitionDisplay(): boolean {
  if (displayTransitionSupport !== undefined) return displayTransitionSupport;
  if (!cssSupports('transition-behavior', 'allow-discrete') || !document.body) return false;
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = 'none';
  displayTransitionSupport = getComputedStyle(probe).display === 'block';
  probe.remove();
  return displayTransitionSupport;
}

function supportsTopLayerExit(): boolean {
  return cssSupports('overlay', 'auto') && canTransitionDisplay();
}

/** CSS dashed idents can't contain the colons React's useId produces. */
export function toAnchorName(id: string): string {
  return `--akds-anchor-${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

export interface PopoverPosition {
  top: number;
  left: number;
  width?: number;
  vertical: 'top' | 'bottom';
}

/**
 * Script positioning for browsers without CSS anchor positioning: below/above
 * the anchor, flipping on either axis when it would overflow and clamping to
 * the viewport.
 */
export function calcPosition(
  anchor: HTMLElement,
  popup: HTMLElement,
  placement: PopoverPlacement,
  matchAnchorWidth = false,
): PopoverPosition {
  const ar = anchor.getBoundingClientRect();
  const pr = popup.getBoundingClientRect();
  const width = matchAnchorWidth ? ar.width : pr.width;
  const height = pr.height;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let vertical: 'top' | 'bottom' = placement.startsWith('bottom') ? 'bottom' : 'top';
  const fitsBelow = ar.bottom + GAP + height <= vh;
  const fitsAbove = ar.top - GAP - height >= 0;
  if (vertical === 'bottom' && !fitsBelow && fitsAbove) vertical = 'top';
  else if (vertical === 'top' && !fitsAbove && fitsBelow) vertical = 'bottom';

  const alignStart = placement.endsWith('left');
  let left = alignStart ? ar.left : ar.right - width;
  if (alignStart && left + width > vw && ar.right - width >= 0) left = ar.right - width;
  else if (!alignStart && left < 0 && ar.left + width <= vw) left = ar.left;
  left = Math.max(0, Math.min(left, vw - width));

  let top = vertical === 'bottom' ? ar.bottom + GAP : ar.top - height - GAP;
  top = Math.max(0, Math.min(top, vh - height));

  return matchAnchorWidth ? { top, left, width, vertical } : { top, left, vertical };
}

function isShowing(el: HTMLElement, fallback: boolean): boolean {
  try {
    return el.matches(':popover-open');
  } catch {
    return fallback;
  }
}

/** Calls `done` once the element's running animations/transitions settle. */
function whenAnimationsSettle(el: HTMLElement, done: () => void) {
  const animations = typeof el.getAnimations === 'function' ? el.getAnimations({ subtree: true }) : [];
  if (animations.length === 0) {
    done();
    return;
  }
  let called = false;
  const finish = () => {
    if (called) return;
    called = true;
    done();
  };
  Promise.all(animations.map(a => a.finished.catch(() => undefined))).then(finish, finish);
  setTimeout(finish, EXIT_TIMEOUT_MS);
}

const subscribeNoop = () => () => {};
const serverSnapshot = () => false;

export interface UseAnchoredPopoverOptions {
  open: boolean;
  popoverRef: React.RefObject<HTMLElement>;
  /** Element the popup is positioned against. Omit for an inline (non-popover) popup. */
  anchorRef?: React.RefObject<HTMLElement> | undefined;
  /**
   * The control that toggles the popup. Pressing it is not treated as a light
   * dismiss, and focus returns to it on close. Defaults to `anchorRef`.
   */
  triggerRef?: React.RefObject<HTMLElement> | undefined;
  /** 'auto' gives native light dismiss + Escape; 'manual' leaves dismissal to the caller. */
  mode?: 'auto' | 'manual';
  placement?: PopoverPlacement;
  matchAnchorWidth?: boolean;
  /** Positioning when the Popover API is unavailable. */
  legacyPositioning?: 'js' | 'css';
  /** Native light dismiss or Escape closed the popover. */
  onDismiss?: () => void;
  /** Return focus to the trigger when the popup closes with focus inside it. */
  restoreFocus?: boolean;
}

export interface UseAnchoredPopoverResult {
  /** Render the popup while true (stays true during the exit transition). */
  mounted: boolean;
  /** The popup is a native top-layer popover. */
  native: boolean;
  /** Spread onto the popup element. */
  popoverProps: Record<string, string>;
  /** Script position (null until measured, or when CSS positions the popup). */
  position: PopoverPosition | null;
  /** Script positioning is in use — apply `position` as fixed coordinates. */
  usesJsPosition: boolean;
  /** Call before closing for a reason that should not move focus (e.g. Tab). */
  skipFocusRestore: () => void;
}

export function useAnchoredPopover({
  open,
  popoverRef,
  anchorRef,
  triggerRef = anchorRef,
  mode = 'auto',
  placement = 'bottom-left',
  matchAnchorWidth = false,
  legacyPositioning = 'css',
  onDismiss,
  restoreFocus = false,
}: UseAnchoredPopoverOptions): UseAnchoredPopoverResult {
  const isPopover = anchorRef !== undefined;
  // Server snapshot is false so hydration matches; the client re-renders with support.
  const popoverSupported = React.useSyncExternalStore(subscribeNoop, supportsPopover, serverSnapshot);
  const native = isPopover && popoverSupported;
  const usesJsPosition = isPopover && (native ? !supportsAnchorPositioning() : legacyPositioning === 'js');

  const [closing, setClosing] = React.useState(false);
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    setClosing(!open);
  }
  const mounted = open || closing;

  const [position, setPosition] = React.useState<PopoverPosition | null>(null);
  const anchorName = toAnchorName(React.useId());

  const openRef = React.useRef(open);
  openRef.current = open;
  const onDismissRef = React.useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const tokenRef = React.useRef(0);
  const shownRef = React.useRef(false);
  const triggerPressRef = React.useRef(false);
  const lastInputPointerRef = React.useRef(false);
  const focusWasInsideRef = React.useRef(false);
  const skipRestoreRef = React.useRef(false);

  const show = React.useCallback(() => {
    const el = popoverRef.current;
    if (!el || !native || isShowing(el, shownRef.current)) return;
    try {
      // `source` sets the implicit anchor where supported; ignored elsewhere.
      (el.showPopover as (options?: { source?: HTMLElement }) => void)(
        triggerRef?.current ? { source: triggerRef.current } : undefined,
      );
      shownRef.current = true;
    } catch {
      // Element disconnected or already shown in another way — nothing to do.
    }
  }, [native, popoverRef, triggerRef]);

  const hide = React.useCallback(() => {
    const el = popoverRef.current;
    if (!el || !native) return;
    shownRef.current = false;
    if (!isShowing(el, true)) return;
    try {
      el.hidePopover();
    } catch {
      // Already hidden.
    }
  }, [native, popoverRef]);

  const resync = React.useCallback(() => {
    if (openRef.current) show();
  }, [show]);

  const updatePosition = React.useCallback(() => {
    const anchor = anchorRef?.current;
    const el = popoverRef.current;
    if (!anchor || !el) return;
    const next = calcPosition(anchor, el, placement, matchAnchorWidth);
    setPosition(prev => (
      prev &&
      prev.top === next.top &&
      prev.left === next.left &&
      prev.width === next.width &&
      prev.vertical === next.vertical
        ? prev
        : next
    ));
  }, [anchorRef, popoverRef, placement, matchAnchorWidth]);

  // Tie the anchor and the popup together with a per-instance anchor name.
  React.useLayoutEffect(() => {
    if (!mounted || !native || !supportsAnchorPositioning()) return;
    const anchor = anchorRef?.current;
    const el = popoverRef.current;
    if (!anchor || !el) return;
    const previous = anchor.style.getPropertyValue('anchor-name');
    anchor.style.setProperty('anchor-name', anchorName);
    el.style.setProperty('position-anchor', anchorName);
    return () => {
      if (previous) anchor.style.setProperty('anchor-name', previous);
      else anchor.style.removeProperty('anchor-name');
    };
  }, [mounted, native, anchorRef, popoverRef, anchorName]);

  // Open / close sequencing.
  React.useLayoutEffect(() => {
    const el = popoverRef.current;
    if (!el) return;
    const token = ++tokenRef.current;

    if (open) {
      el.removeAttribute('data-closing');
      show();
      return;
    }

    // Closing: return focus to the trigger before hiding, so it never lands on <body>.
    const active = document.activeElement;
    const focusInside = el.contains(active) ||
      (focusWasInsideRef.current && (active === null || active === document.body));
    if (restoreFocus && focusInside && !skipRestoreRef.current) {
      const trigger = triggerRef?.current;
      if (trigger) {
        trigger.focus(lastInputPointerRef.current ? ({ focusVisible: false } as FocusOptions) : undefined);
      }
    }
    skipRestoreRef.current = false;
    focusWasInsideRef.current = false;

    const finish = () => {
      if (tokenRef.current !== token) return;
      el.removeAttribute('data-closing');
      hide();
      setClosing(false);
    };

    if (native && supportsTopLayerExit()) {
      // `overlay` + `display` transitions keep it rendered through the exit.
      hide();
      whenAnimationsSettle(el, () => {
        if (tokenRef.current === token) setClosing(false);
      });
    } else {
      // Exit fallback: animate via [data-closing] while still shown, then hide.
      el.setAttribute('data-closing', '');
      whenAnimationsSettle(el, finish);
    }
  }, [open, mounted, native, show, hide, restoreFocus, triggerRef, popoverRef]);

  // Native close requests (light dismiss, Escape) → tell the owner.
  React.useLayoutEffect(() => {
    const el = popoverRef.current;
    if (!mounted || !native || !el) return;

    const handleBeforeToggle = (e: Event) => {
      if ((e as Event & { newState?: string }).newState !== 'closed') return;
      focusWasInsideRef.current = el.contains(document.activeElement) && !lastInputPointerRef.current;
    };
    const handleToggle = (e: Event) => {
      if ((e as Event & { newState?: string }).newState !== 'closed') return;
      if (isShowing(el, false)) return;
      shownRef.current = false;
      if (!openRef.current) return;
      // Pressing the trigger light-dismisses before its click toggles the
      // owner's state; let that click decide, then resync on pointerup.
      if (triggerPressRef.current) return;
      onDismissRef.current?.();
      setTimeout(resync, 0);
    };
    el.addEventListener('beforetoggle', handleBeforeToggle);
    el.addEventListener('toggle', handleToggle);
    return () => {
      el.removeEventListener('beforetoggle', handleBeforeToggle);
      el.removeEventListener('toggle', handleToggle);
    };
  }, [mounted, native, popoverRef, resync]);

  // Track input modality and trigger presses while open.
  React.useEffect(() => {
    if (!open || !isPopover) return;
    const trigger = triggerRef?.current;

    const handleDocPointerDown = () => { lastInputPointerRef.current = true; };
    const handleDocKeyDown = () => { lastInputPointerRef.current = false; };
    const handleTriggerPointerDown = () => {
      if (mode !== 'auto' || !native) return;
      triggerPressRef.current = true;
      const release = () => {
        window.removeEventListener('pointerup', release, true);
        window.removeEventListener('pointercancel', release, true);
        // After the click that follows has run.
        setTimeout(() => {
          triggerPressRef.current = false;
          resync();
        }, 0);
      };
      window.addEventListener('pointerup', release, true);
      window.addEventListener('pointercancel', release, true);
    };

    document.addEventListener('pointerdown', handleDocPointerDown, true);
    document.addEventListener('keydown', handleDocKeyDown, true);
    trigger?.addEventListener('pointerdown', handleTriggerPointerDown, true);
    return () => {
      document.removeEventListener('pointerdown', handleDocPointerDown, true);
      document.removeEventListener('keydown', handleDocKeyDown, true);
      trigger?.removeEventListener('pointerdown', handleTriggerPointerDown, true);
    };
  }, [open, isPopover, native, mode, triggerRef, resync]);

  // Script positioning (fallback): measure after show, follow scroll/resize.
  React.useLayoutEffect(() => {
    if (!open || !usesJsPosition) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, usesJsPosition, updatePosition]);

  React.useEffect(() => {
    if (!mounted) setPosition(null);
  }, [mounted]);

  const skipFocusRestore = React.useCallback(() => {
    skipRestoreRef.current = true;
  }, []);

  return {
    mounted,
    native,
    // Only set where supported: an inert `popover` attribute would otherwise
    // match `[popover]` rules meant for the top-layer path.
    popoverProps: native ? { popover: mode } : {},
    position,
    usesJsPosition,
    skipFocusRestore,
  };
}
