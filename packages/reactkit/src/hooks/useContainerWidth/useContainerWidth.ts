import { useEffect, useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

// useLayoutEffect measures before the first paint, so the right layout shows
// straight away. React 18 warns about it during a server render, where it
// never runs anyway, so the server gets useEffect instead.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// The content box width, the same width CSS container queries compare:
// without padding, border, or a scrollbar. clientWidth includes padding, so
// it's taken off.
function contentWidth(element: HTMLElement): number {
  const style = window.getComputedStyle(element);
  return element.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
}

/**
 * Watches an element's width and keeps `select(width)` in state. React skips
 * the re-render when the selected value is unchanged, so a hook that selects
 * a boolean only re-renders when it flips, not on every pixel of a resize.
 * @internal
 */
export function useContainerValue<T>(
  ref: RefObject<HTMLElement | null>,
  select: (width: number) => T,
  initialValue: T,
): T {
  const [value, setValue] = useState<T>(initialValue);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    // Measured now rather than waiting for the observer's first callback,
    // which can come a frame later and flash the initial value.
    setValue(select(contentWidth(element)));
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setValue(select(entry.contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
    // A new select (a new breakpoint) measures again with the new threshold.
  }, [ref, select]);

  return value;
}

const identity = (width: number) => width;

/**
 * Returns an element's content box width in pixels, and re-renders whenever
 * it changes. `null` until the element is measured: during a server render,
 * and in the render before the first measurement, which happens before the
 * first paint.
 *
 * Re-renders on every pixel of a resize. To switch layouts at a breakpoint,
 * use `useContainerBreakpointUp` or `useContainerBreakpointDown`, which only
 * re-render when the breakpoint is crossed.
 */
export function useContainerWidth(ref: RefObject<HTMLElement | null>): number | null {
  return useContainerValue<number | null>(ref, identity, null);
}
