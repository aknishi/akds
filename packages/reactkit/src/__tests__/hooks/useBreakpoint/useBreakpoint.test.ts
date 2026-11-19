import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { useBreakpointUp, useBreakpointDown } from '../../../hooks/useBreakpoint/useBreakpoint';

// A matchMedia that evaluates min-width queries against a viewport width.
function mockViewport(initialWidth: number) {
  let width = initialWidth;
  const listeners = new Set<() => void>();
  window.matchMedia = vi.fn((query: string) => {
    const minWidth = Number(/\(min-width: (\d+)px\)/.exec(query)?.[1]);
    return {
      get matches() {
        return width >= minWidth;
      },
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    } as unknown as MediaQueryList;
  });
  return {
    resize(next: number) {
      width = next;
      listeners.forEach((listener) => listener());
    },
  };
}

describe('useBreakpointUp', () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
  });

  it('queries the min-width from the breakpoint token', () => {
    mockViewport(1024);
    renderHook(() => useBreakpointUp('md'));
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
  });

  it('is true at exactly the breakpoint and above, false below it', () => {
    const viewport = mockViewport(767);
    const { result } = renderHook(() => useBreakpointUp('md'));
    expect(result.current).toBe(false);
    act(() => viewport.resize(768));
    expect(result.current).toBe(true);
    act(() => viewport.resize(1280));
    expect(result.current).toBe(true);
  });

  it('returns false during a server render', () => {
    function Probe() {
      return React.createElement('span', null, String(useBreakpointUp('md')));
    }
    expect(renderToString(React.createElement(Probe))).toContain('false');
  });
});

describe('useBreakpointDown', () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
  });

  it('is true below the breakpoint and false at exactly the breakpoint', () => {
    const viewport = mockViewport(767);
    const { result } = renderHook(() => useBreakpointDown('md'));
    expect(result.current).toBe(true);
    act(() => viewport.resize(768));
    expect(result.current).toBe(false);
  });

  it('is always the opposite of useBreakpointUp', () => {
    const viewport = mockViewport(320);
    const { result } = renderHook(() => ({ up: useBreakpointUp('sm'), down: useBreakpointDown('sm') }));
    for (const width of [320, 479, 480, 481, 1536]) {
      act(() => viewport.resize(width));
      expect(result.current.down).toBe(!result.current.up);
    }
  });

  it('returns true during a server render', () => {
    function Probe() {
      return React.createElement('span', null, String(useBreakpointDown('md')));
    }
    expect(renderToString(React.createElement(Probe))).toContain('true');
  });
});
