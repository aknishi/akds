import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { useContainerWidth } from '../../../hooks/useContainerWidth/useContainerWidth';
import {
  useContainerBreakpointUp,
  useContainerBreakpointDown,
} from '../../../hooks/useContainerBreakpoint/useContainerBreakpoint';

// jsdom has no layout or ResizeObserver: the element's clientWidth is set by
// hand, and resize() calls the observer the way a browser would.
const observers = new Set<MockResizeObserver>();
class MockResizeObserver {
  callback: ResizeObserverCallback;
  observe = vi.fn();
  disconnect = vi.fn(() => observers.delete(this));
  unobserve = vi.fn();
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    observers.add(this);
  }
}

function createContainer(width: number) {
  const element = document.createElement('div');
  Object.defineProperty(element, 'clientWidth', { configurable: true, value: width });
  document.body.appendChild(element);
  const ref = { current: element };
  return {
    ref,
    resize(next: number) {
      Object.defineProperty(element, 'clientWidth', { configurable: true, value: next });
      const entry = { target: element, contentRect: { width: next } } as unknown as ResizeObserverEntry;
      observers.forEach((observer) => observer.callback([entry], observer as unknown as ResizeObserver));
    },
  };
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
  observers.clear();
  document.body.innerHTML = '';
});

describe('useContainerWidth', () => {
  it('measures the element before the first paint and follows resizes', () => {
    const container = createContainer(640);
    const { result } = renderHook(() => useContainerWidth(container.ref));
    expect(result.current).toBe(640);
    act(() => container.resize(900));
    expect(result.current).toBe(900);
  });

  it('measures the content box, without padding', () => {
    const container = createContainer(640);
    container.ref.current.style.padding = '0 16px';
    const { result } = renderHook(() => useContainerWidth(container.ref));
    expect(result.current).toBe(608);
  });

  it('returns null while there is no element to measure', () => {
    const { result } = renderHook(() => useContainerWidth({ current: null }));
    expect(result.current).toBeNull();
  });

  it('disconnects the observer on unmount', () => {
    const container = createContainer(640);
    const { unmount } = renderHook(() => useContainerWidth(container.ref));
    const [observer] = observers;
    unmount();
    expect(observer?.disconnect).toHaveBeenCalled();
  });

  it('returns null during a server render', () => {
    function Probe() {
      return React.createElement('span', null, String(useContainerWidth({ current: null })));
    }
    expect(renderToString(React.createElement(Probe))).toContain('null');
  });
});

describe('useContainerBreakpointUp', () => {
  it('is true at exactly the breakpoint and above, false below it', () => {
    const container = createContainer(767);
    const { result } = renderHook(() => useContainerBreakpointUp(container.ref, 'md'));
    expect(result.current).toBe(false);
    act(() => container.resize(768));
    expect(result.current).toBe(true);
    act(() => container.resize(1280));
    expect(result.current).toBe(true);
  });

  it('re-renders only when the breakpoint is crossed', () => {
    const container = createContainer(800);
    // Counts commits: React may call a component once more before skipping
    // an unchanged state update, but it doesn't commit that render.
    let renders = 0;
    renderHook(() => {
      React.useEffect(() => {
        renders += 1;
      });
      return useContainerBreakpointUp(container.ref, 'md');
    });
    const afterMount = renders;
    act(() => container.resize(900));
    act(() => container.resize(1000));
    expect(renders).toBe(afterMount);
    act(() => container.resize(700));
    expect(renders).toBe(afterMount + 1);
  });

  it('measures again when the breakpoint changes', () => {
    const container = createContainer(600);
    const { result, rerender } = renderHook(({ breakpoint }) => useContainerBreakpointUp(container.ref, breakpoint), {
      initialProps: { breakpoint: 'md' as 'md' | 'sm' },
    });
    expect(result.current).toBe(false);
    rerender({ breakpoint: 'sm' });
    expect(result.current).toBe(true);
  });

  it('returns false during a server render, or initialValue', () => {
    function Probe({ initialValue }: { initialValue?: boolean }) {
      const value = useContainerBreakpointUp({ current: null }, 'md', initialValue === undefined ? {} : { initialValue });
      return React.createElement('span', null, String(value));
    }
    expect(renderToString(React.createElement(Probe))).toContain('false');
    expect(renderToString(React.createElement(Probe, { initialValue: true }))).toContain('true');
  });
});

describe('useContainerBreakpointDown', () => {
  it('is true below the breakpoint and false at exactly the breakpoint', () => {
    const container = createContainer(767);
    const { result } = renderHook(() => useContainerBreakpointDown(container.ref, 'md'));
    expect(result.current).toBe(true);
    act(() => container.resize(768));
    expect(result.current).toBe(false);
  });

  it('is always the opposite of useContainerBreakpointUp', () => {
    const container = createContainer(320);
    const { result } = renderHook(() => ({
      up: useContainerBreakpointUp(container.ref, 'sm'),
      down: useContainerBreakpointDown(container.ref, 'sm'),
    }));
    for (const width of [320, 479, 480, 481, 1536]) {
      act(() => container.resize(width));
      expect(result.current.down).toBe(!result.current.up);
    }
  });

  it('returns true during a server render, or initialValue', () => {
    function Probe({ initialValue }: { initialValue?: boolean }) {
      const value = useContainerBreakpointDown({ current: null }, 'md', initialValue === undefined ? {} : { initialValue });
      return React.createElement('span', null, String(value));
    }
    expect(renderToString(React.createElement(Probe))).toContain('true');
    expect(renderToString(React.createElement(Probe, { initialValue: false }))).toContain('false');
  });
});
