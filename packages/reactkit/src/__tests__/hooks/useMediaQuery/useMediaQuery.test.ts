import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { useMediaQuery } from '../../../hooks/useMediaQuery/useMediaQuery';

function mockMatchMedia(initial: boolean) {
  let matches = initial;
  const listeners = new Set<() => void>();
  const mediaQueryList = {
    get matches() {
      return matches;
    },
    addEventListener: vi.fn((_: string, listener: () => void) => listeners.add(listener)),
    removeEventListener: vi.fn((_: string, listener: () => void) => listeners.delete(listener)),
  };
  window.matchMedia = vi.fn(() => mediaQueryList as unknown as MediaQueryList);
  return {
    mediaQueryList,
    listeners,
    change(next: boolean) {
      matches = next;
      listeners.forEach((listener) => listener());
    },
  };
}

describe('useMediaQuery', () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
  });

  it('returns the current match', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
  });

  it('updates when the query starts or stops matching', () => {
    const media = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
    act(() => media.change(true));
    expect(result.current).toBe(true);
    act(() => media.change(false));
    expect(result.current).toBe(false);
  });

  it('removes its listener on unmount', () => {
    const media = mockMatchMedia(false);
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(media.listeners.size).toBe(1);
    unmount();
    expect(media.mediaQueryList.removeEventListener).toHaveBeenCalled();
    expect(media.listeners.size).toBe(0);
  });

  it('returns false when matchMedia is unavailable', () => {
    // @ts-expect-error simulating an environment without matchMedia
    delete window.matchMedia;
    const { result, unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
    unmount();
  });

  it('returns false during a server render', () => {
    function Probe() {
      return React.createElement('span', null, String(useMediaQuery('(min-width: 768px)')));
    }
    expect(renderToString(React.createElement(Probe))).toContain('false');
  });
});
