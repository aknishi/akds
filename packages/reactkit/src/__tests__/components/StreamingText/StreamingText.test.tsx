import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { StreamingText } from '../../../components/StreamingText/StreamingText';

expect.extend(toHaveNoViolations);

function mockPrefersReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

afterEach(() => {
  // @ts-expect-error jsdom does not implement matchMedia by default
  delete window.matchMedia;
});

describe('StreamingText', () => {
  it('applies default classes', () => {
    const { container } = render(<StreamingText text="Hi" />);
    expect(container.firstChild).toHaveClass('akds-streaming-text');
  });

  it('does not render a cursor when cursor is false', () => {
    const { container } = render(<StreamingText text="Hi" cursor={false} />);
    expect(container.querySelector('.akds-streaming-text__cursor')).not.toBeInTheDocument();
  });

  it('shows a cursor by default while streaming', () => {
    const { container } = render(<StreamingText text="Hi" speed={10} />);
    expect(container.querySelector('.akds-streaming-text__cursor')).toBeInTheDocument();
  });

  it('reveals the full text immediately when prefers-reduced-motion is set', () => {
    mockPrefersReducedMotion(true);
    const { container } = render(<StreamingText text="Hello" speed={10} />);
    expect(container.querySelectorAll('.akds-streaming-text__char')).toHaveLength(5);
    expect(container.querySelector('.akds-streaming-text__cursor')).not.toBeInTheDocument();
  });

  it('forwards additional HTML attributes', () => {
    const { container } = render(<StreamingText text="Hi" data-testid="stream" />);
    expect(container.querySelector('[data-testid="stream"]')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<StreamingText ref={ref} text="Hi" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describe('with fake timers', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('reveals characters progressively', () => {
      const { container } = render(<StreamingText text="Hello" speed={10} />);
      act(() => { vi.advanceTimersByTime(10 * 2); });
      expect(container.querySelectorAll('.akds-streaming-text__char')).toHaveLength(2);
      act(() => { vi.advanceTimersByTime(10 * 3); });
      expect(container.querySelectorAll('.akds-streaming-text__char')).toHaveLength(5);
    });

    it('hides the cursor once streaming completes', () => {
      const { container } = render(<StreamingText text="Hi" speed={10} />);
      act(() => { vi.advanceTimersByTime(10 * 2); });
      expect(container.querySelector('.akds-streaming-text__cursor')).not.toBeInTheDocument();
    });

    it('renders the full text in the accessible live region once complete', () => {
      const { container } = render(<StreamingText text="Hello" speed={10} />);
      act(() => { vi.advanceTimersByTime(10 * 5); });
      expect(container.querySelector('[role="status"]')).toHaveTextContent('Hello');
    });

    it('calls onComplete once after streaming finishes', () => {
      const onComplete = vi.fn();
      render(<StreamingText text="Hi" speed={10} onComplete={onComplete} />);
      act(() => { vi.advanceTimersByTime(10 * 2); });
      expect(onComplete).toHaveBeenCalledTimes(1);
      act(() => { vi.advanceTimersByTime(10 * 5); });
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('restarts the reveal when the text prop changes', () => {
      const { container, rerender } = render(<StreamingText text="Hi" speed={10} />);
      act(() => { vi.advanceTimersByTime(10 * 2); });
      expect(container.querySelectorAll('.akds-streaming-text__char')).toHaveLength(2);

      rerender(<StreamingText text="Bye now" speed={10} />);
      expect(container.querySelectorAll('.akds-streaming-text__char')).toHaveLength(0);
    });
  });

  describe('axe accessibility', () => {
    it('has no violations mid-stream', async () => {
      const { container } = render(<StreamingText text="Hello there" speed={10} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with prefers-reduced-motion', async () => {
      mockPrefersReducedMotion(true);
      const { container } = render(<StreamingText text="Hello" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
