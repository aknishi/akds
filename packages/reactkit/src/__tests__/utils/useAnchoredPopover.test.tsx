import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { calcPosition, toAnchorName } from '../../utils/useAnchoredPopover';
import type { UseAnchoredPopoverOptions } from '../../utils/useAnchoredPopover';
import { stubPopoverApi } from '../components/Menu/popoverStub';

type HarnessProps = Omit<UseAnchoredPopoverOptions, 'popoverRef' | 'anchorRef' | 'triggerRef'> & {
  setup?: (popup: HTMLElement) => void;
};

// Imported per test so module-level feature caches start fresh.
async function loadHook() {
  vi.resetModules();
  return (await import('../../utils/useAnchoredPopover')).useAnchoredPopover;
}

async function makeHarness() {
  const useAnchoredPopover = await loadHook();
  return function Harness({ setup, ...options }: HarnessProps) {
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const popoverRef = React.useRef<HTMLDivElement>(null);
    const result = useAnchoredPopover({ ...options, popoverRef, anchorRef });
    React.useLayoutEffect(() => {
      if (popoverRef.current) setup?.(popoverRef.current);
    });
    return (
      <>
        <button ref={anchorRef} style={{ anchorName: '--existing' } as React.CSSProperties}>Trigger</button>
        {result.mounted && (
          <div
            ref={popoverRef}
            data-testid="popup"
            data-top={result.position?.top}
            {...result.popoverProps}
          >
            <button>Inside</button>
          </div>
        )}
      </>
    );
  };
}

function rect(r: Partial<DOMRect>): DOMRect {
  const { top = 0, left = 0, width = 0, height = 0 } = r;
  return { top, left, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) } as DOMRect;
}

function elementWithRect(r: Partial<DOMRect>): HTMLElement {
  const el = document.createElement('div');
  el.getBoundingClientRect = () => rect(r);
  return el;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('calcPosition', () => {
  // jsdom's window is 1024 × 768.
  const popup = elementWithRect({ width: 200, height: 100 });

  it('places below the anchor, aligned to its start', () => {
    const anchor = elementWithRect({ top: 100, left: 50, width: 80, height: 30 });
    expect(calcPosition(anchor, popup, 'bottom-left')).toEqual({ top: 134, left: 50, vertical: 'bottom' });
  });

  it('flips above when there is no room below, and back below when there is no room above', () => {
    const nearBottom = elementWithRect({ top: 700, left: 50, width: 80, height: 30 });
    expect(calcPosition(nearBottom, popup, 'bottom-left').vertical).toBe('top');
    const nearTop = elementWithRect({ top: 10, left: 50, width: 80, height: 30 });
    expect(calcPosition(nearTop, popup, 'top-left').vertical).toBe('bottom');
  });

  it('flips horizontally when the preferred alignment would overflow', () => {
    const nearRight = elementWithRect({ top: 100, left: 900, width: 80, height: 30 });
    expect(calcPosition(nearRight, popup, 'bottom-left').left).toBe(780);
    const nearLeft = elementWithRect({ top: 100, left: 10, width: 80, height: 30 });
    expect(calcPosition(nearLeft, popup, 'bottom-right').left).toBe(10);
  });

  it('matches the anchor width when asked', () => {
    const anchor = elementWithRect({ top: 100, left: 50, width: 300, height: 30 });
    expect(calcPosition(anchor, popup, 'bottom-left', true)).toMatchObject({ width: 300 });
  });
});

describe('toAnchorName', () => {
  it('strips characters CSS dashed idents cannot hold', () => {
    expect(toAnchorName(':r1:')).toBe('--akds-anchor-r1');
  });
});

describe('useAnchoredPopover', () => {
  it('ties the anchor and popup with an anchor name and restores the previous one', async () => {
    const popover = stubPopoverApi({ anchorPositioning: true });
    try {
      const Harness = await makeHarness();
      const { rerender } = render(<Harness open />);
      const trigger = screen.getByText('Trigger');
      expect(trigger.style.getPropertyValue('anchor-name')).toMatch(/^--akds-anchor-/);
      expect(screen.getByTestId('popup').style.getPropertyValue('position-anchor')).toBe(
        trigger.style.getPropertyValue('anchor-name'),
      );
      rerender(<Harness open={false} />);
      await act(async () => {});
      expect(trigger.style.getPropertyValue('anchor-name')).toBe('--existing');
    } finally {
      popover.restore();
    }
  });

  it('uses the top-layer exit where overlay and display transitions work, waiting for animations', async () => {
    const popover = stubPopoverApi();
    vi.stubGlobal('CSS', { supports: (prop: string) => prop === 'overlay' || prop === 'transition-behavior' });
    const realGetComputedStyle = window.getComputedStyle;
    // The probe sees `display` still `block` after setting `none`: the transition is honored.
    vi.spyOn(window, 'getComputedStyle').mockImplementation(
      (el: Element) => ({ ...realGetComputedStyle(el), display: 'block' }) as CSSStyleDeclaration,
    );
    try {
      const Harness = await makeHarness();
      let finishAnimation!: () => void;
      const finished = new Promise<void>(r => { finishAnimation = r; });
      const setup = (el: HTMLElement) => {
        el.getAnimations = () => [{ finished }] as unknown as Animation[];
      };
      const { rerender } = render(<Harness open setup={setup} />);
      rerender(<Harness open={false} setup={setup} />);
      // Hidden immediately (overlay keeps it painted), unmounted after the exit.
      expect(popover.hidePopover).toHaveBeenCalled();
      expect(screen.getByTestId('popup')).not.toHaveAttribute('data-closing');
      await act(async () => { finishAnimation(); });
      expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
    } finally {
      popover.restore();
      vi.restoreAllMocks();
    }
  });

  it('falls back to a data-closing exit with a timeout when animations never settle', async () => {
    vi.useFakeTimers();
    const popover = stubPopoverApi();
    try {
      const Harness = await makeHarness();
      const setup = (el: HTMLElement) => {
        el.getAnimations = () => [{ finished: new Promise(() => {}) }] as unknown as Animation[];
      };
      const { rerender } = render(<Harness open setup={setup} />);
      rerender(<Harness open={false} setup={setup} />);
      expect(screen.getByTestId('popup')).toHaveAttribute('data-closing');
      await act(async () => { vi.advanceTimersByTime(400); });
      expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
    } finally {
      popover.restore();
    }
  });

  it('treats :popover-open as unknown when the selector throws', async () => {
    const proto = HTMLElement.prototype as unknown as Record<string, unknown>;
    Object.defineProperty(proto, 'popover', { configurable: true, value: null, writable: true });
    const showPopover = vi.fn();
    const hidePopover = vi.fn();
    proto.showPopover = showPopover;
    proto.hidePopover = hidePopover;
    const realMatches = Element.prototype.matches;
    Element.prototype.matches = function (this: Element, selector: string) {
      if (selector === ':popover-open') throw new SyntaxError('unsupported');
      return realMatches.call(this, selector);
    };
    try {
      const Harness = await makeHarness();
      const { rerender } = render(<Harness open />);
      expect(showPopover).toHaveBeenCalledTimes(1);
      rerender(<Harness open={false} />);
      expect(hidePopover).toHaveBeenCalled();
    } finally {
      Element.prototype.matches = realMatches;
      delete proto.popover;
      delete proto.showPopover;
      delete proto.hidePopover;
    }
  });

  it('reports a native light dismiss, but not one caused by pressing the trigger', async () => {
    vi.useFakeTimers();
    const popover = stubPopoverApi();
    try {
      const Harness = await makeHarness();
      const onDismiss = vi.fn();
      render(<Harness open onDismiss={onDismiss} />);
      const popup = screen.getByTestId('popup');

      // Still showing (e.g. reopened): not a dismiss.
      act(() => { popup.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'closed' })); });
      expect(onDismiss).not.toHaveBeenCalled();

      // Pressing the trigger light-dismisses first; its click decides instead.
      fireEvent.pointerDown(screen.getByText('Trigger'));
      act(() => { popover.nativeClose(popup); });
      expect(onDismiss).not.toHaveBeenCalled();
      fireEvent.pointerUp(window);
      act(() => { vi.runAllTimers(); });
      // Owner kept it open, so it is shown again.
      expect(popover.isShown(popup)).toBe(true);

      // A real light dismiss (outside press) is reported.
      fireEvent.pointerDown(document.body);
      act(() => { popover.nativeClose(popup); });
      expect(onDismiss).toHaveBeenCalledTimes(1);
    } finally {
      popover.restore();
    }
  });

  it('positions with script where anchor positioning is unsupported, and follows scroll', async () => {
    const popover = stubPopoverApi();
    try {
      const Harness = await makeHarness();
      render(<Harness open />);
      const popup = screen.getByTestId('popup');
      expect(popup).toHaveAttribute('data-top');
      const before = popup.getAttribute('data-top');
      // An unchanged measurement keeps the same position object (no re-render loop).
      act(() => { window.dispatchEvent(new Event('scroll')); });
      expect(popup.getAttribute('data-top')).toBe(before);
    } finally {
      popover.restore();
    }
  });
});
