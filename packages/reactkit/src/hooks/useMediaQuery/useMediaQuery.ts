import { useCallback, useSyncExternalStore } from 'react';

const hasMatchMedia = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function';

/** Returns whether the media query currently matches, and re-renders when that changes. */
export function useMediaQuery(query: string): boolean {
  // useSyncExternalStore subscribes before the first paint and never shows a
  // stale value, unlike reading matchMedia in a useEffect.
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!hasMatchMedia()) return () => {};
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onChange);
      return () => mediaQueryList.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => hasMatchMedia() && window.matchMedia(query).matches,
    // Server render: no viewport, so assume the query doesn't match.
    () => false,
  );
}
