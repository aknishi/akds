import { useCallback } from 'react';
import type { RefObject } from 'react';
import { breakpoints } from '@aknishi/akds-tokens';
import type { Breakpoint } from '@aknishi/akds-tokens';
import { useContainerValue } from '../useContainerWidth/useContainerWidth';

export interface UseContainerBreakpointOptions {
  /**
   * The value before the element is measured: during a server render, and in
   * the render before the first measurement. Defaults to the small layout:
   * `false` for `useContainerBreakpointUp`, `true` for
   * `useContainerBreakpointDown`.
   */
  initialValue?: boolean;
}

/**
 * Returns whether an element's content box is at least the given breakpoint
 * wide: `md` and larger. A breakpoint is where its size starts, so
 * `useContainerBreakpointUp(ref, 'md')` is true at exactly 768px. Re-renders
 * only when the breakpoint is crossed.
 */
export function useContainerBreakpointUp(
  ref: RefObject<HTMLElement | null>,
  breakpoint: Breakpoint,
  { initialValue = false }: UseContainerBreakpointOptions = {},
): boolean {
  const minWidth = breakpoints[breakpoint];
  const select = useCallback((width: number) => width >= minWidth, [minWidth]);
  return useContainerValue(ref, select, initialValue);
}

/**
 * Returns whether an element's content box is narrower than the given
 * breakpoint, not including it: `useContainerBreakpointDown(ref, 'md')` is
 * false at exactly 768px. Always the opposite of `useContainerBreakpointUp`.
 */
export function useContainerBreakpointDown(
  ref: RefObject<HTMLElement | null>,
  breakpoint: Breakpoint,
  { initialValue = true }: UseContainerBreakpointOptions = {},
): boolean {
  return !useContainerBreakpointUp(ref, breakpoint, { initialValue: !initialValue });
}
