import React from 'react';

// Component preview cards replay their micro-interaction on a fixed cadence so a
// visitor doesn't have to hover/click an inert card to see the animation. `callback`
// is read through a ref so callers can pass an inline closure without retriggering
// the interval on every render. `delayMs` offsets the first fire (and therefore every
// fire after it, since the interval starts from there) so multiple preview cards on
// the same page don't all animate in lockstep.
export function useAutoRestartInterval(callback: () => void, intervalMs: number, enabled = true, delayMs = 0) {
  const callbackRef = React.useRef(callback);
  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (!enabled) return;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = window.setTimeout(() => {
      callbackRef.current();
      intervalId = window.setInterval(() => callbackRef.current(), intervalMs);
    }, delayMs);
    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [intervalMs, enabled, delayMs]);
}
