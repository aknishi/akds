import React from 'react';
import { useAutoRestartInterval } from './useAutoRestartInterval';

// Matches Button's own press feedback (Button.css `:active`) — scale(0.94), 50ms.
const PRESS_DURATION_MS = 120;

// Button/IconButton expose no imperative "simulate a press" API — RippleBase's ref
// lives inside their own closure — so this fakes a real interaction instead: a
// bubbling pointerdown/pointerup pair (caught by the component's own onPointerDown →
// ripple trigger) plus a direct transform on the DOM node to reproduce the `:active`
// scale, since synthetic events don't put a real element into the browser's `:active`
// state. Works for any ref-forwarded native `<button>` (Button, IconButton, ...).
export function useAutoPress(buttonRef: React.RefObject<HTMLButtonElement>, intervalMs: number, enabled = true, delayMs = 0) {
  const releaseTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    return () => {
      if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);
    };
  }, []);

  const simulatePress = React.useCallback(() => {
    const node = buttonRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const clientX = rect.left + rect.width / 2;
    const clientY = rect.top + rect.height / 2;
    const pointerInit: PointerEventInit = { bubbles: true, cancelable: true, clientX, clientY, pointerId: 1, pointerType: 'mouse', isPrimary: true };

    node.dispatchEvent(new PointerEvent('pointerdown', pointerInit));
    node.style.transform = 'scale(0.94)';
    node.style.transitionDuration = '50ms';

    releaseTimeoutRef.current = setTimeout(() => {
      node.style.transform = '';
      node.style.transitionDuration = '';
      node.dispatchEvent(new PointerEvent('pointerup', pointerInit));
    }, PRESS_DURATION_MS);
  }, [buttonRef]);

  useAutoRestartInterval(simulatePress, intervalMs, enabled, delayMs);
}
