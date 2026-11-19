import { breakpoints } from '@aknishi/akds-tokens';
import type { Breakpoint } from '@aknishi/akds-tokens';
import { useMediaQuery } from '../useMediaQuery/useMediaQuery';

/**
 * Returns whether the viewport is at least the given breakpoint: `md` and
 * larger. A breakpoint is where its size starts, so `useBreakpointUp('md')` is
 * true at exactly 768px. Returns false during a server render.
 */
export function useBreakpointUp(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]}px)`);
}

/**
 * Returns whether the viewport is smaller than the given breakpoint, not
 * including it: `useBreakpointDown('md')` is false at exactly 768px. Always
 * the opposite of `useBreakpointUp`, so true during a server render.
 */
export function useBreakpointDown(breakpoint: Breakpoint): boolean {
  return !useBreakpointUp(breakpoint);
}
