import React from 'react';
import { useDataViewInstance } from './context';

/** Sends a message to screen readers through a polite live region. */
export type Announce = (message: string) => void;

// How long a repeated message stays cleared before it's set again. Long
// enough for screen readers to notice the change, short enough not to lag.
const REPEAT_DELAY_MS = 100;

/**
 * One polite live region for a whole DataView, so Search, BulkActions,
 * Pagination, and sorting don't each keep a region of their own and talk
 * over each other. The region is a `role="status"` element on the body, made
 * on mount: a live region has to be in the page before its text changes to
 * be announced. It uses reactkit's visually hidden class, which every view
 * loads.
 *
 * Setting the same text again changes nothing in the DOM, so a repeated
 * message ("3 results." after a different search) would be silent. It's
 * cleared first and set again a moment later.
 *
 * `enabled: false` skips making a region, for components that already get
 * an announcer from the DataView context.
 */
export function useAnnouncer(enabled = true): Announce {
  const regionRef = React.useRef<HTMLElement | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => {
    if (!enabled) return undefined;
    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.className = 'akds-visually-hidden';
    document.body.appendChild(region);
    regionRef.current = region;
    return () => {
      clearTimeout(timerRef.current);
      region.remove();
      regionRef.current = null;
    };
  }, [enabled]);

  return React.useCallback((message: string) => {
    const region = regionRef.current;
    if (!region || !message) return;
    clearTimeout(timerRef.current);
    if (region.textContent !== message) {
      region.textContent = message;
      return;
    }
    region.textContent = '';
    timerRef.current = setTimeout(() => {
      region.textContent = message;
    }, REPEAT_DELAY_MS);
  }, []);
}

/**
 * The DataView's shared announcer from context, or, for views rendered
 * without one (a headless setup that provides its own context), a region
 * of this component's own.
 */
export function useAnnounce(): Announce {
  const { announce } = useDataViewInstance();
  const fallback = useAnnouncer(!announce);
  return announce ?? fallback;
}
