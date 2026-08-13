import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, act } from '@testing-library/react';
import { ParticleBurst } from '../../../components/ParticleBurst/ParticleBurst';
import type { ParticleBurstHandle } from '../../../components/ParticleBurst/ParticleBurst';

// jsdom has no AnimationEvent implementation, so React never wires up a real
// native 'animationend' listener — dispatching one via fireEvent is a no-op.
// Invoke the handler directly through React's internal fiber props instead.
function fireAnimationEnd(el: Element) {
  const propsKey = Object.keys(el).find(k => k.startsWith('__reactProps$'));
  const props = propsKey ? (el as unknown as Record<string, { onAnimationEnd?: () => void }>)[propsKey] : undefined;
  act(() => {
    props?.onAnimationEnd?.();
  });
}

describe('ParticleBurst', () => {
  it('renders the base element with no bursts initially', () => {
    const { container } = render(<ParticleBurst color="red" spacingFromCenter="8px" />);
    const root = container.querySelector('.akds-particle-burst');
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('.akds-particle-burst__burst')).toHaveLength(0);
  });

  it('applies color and spacing as CSS custom properties', () => {
    const { container } = render(<ParticleBurst color="rgb(1, 2, 3)" spacingFromCenter="12px" />);
    const root = container.querySelector('.akds-particle-burst') as HTMLElement;
    expect(root.style.getPropertyValue('--particle-burst-color')).toBe('rgb(1, 2, 3)');
    expect(root.style.getPropertyValue('--particle-burst-spacing')).toBe('12px');
  });

  it('trigger() spawns a burst with the default particle count', () => {
    const ref = React.createRef<ParticleBurstHandle>();
    const { container } = render(<ParticleBurst ref={ref} color="red" spacingFromCenter="8px" />);
    act(() => ref.current?.trigger());
    expect(container.querySelectorAll('.akds-particle-burst__burst')).toHaveLength(1);
    expect(container.querySelectorAll('.akds-particle-burst__particle')).toHaveLength(8);
  });

  it('trigger() respects a custom particleCount', () => {
    const ref = React.createRef<ParticleBurstHandle>();
    const { container } = render(
      <ParticleBurst ref={ref} color="red" spacingFromCenter="8px" particleCount={3} />,
    );
    act(() => ref.current?.trigger());
    expect(container.querySelectorAll('.akds-particle-burst__particle')).toHaveLength(3);
  });

  it('trigger() does nothing when disabled', () => {
    const ref = React.createRef<ParticleBurstHandle>();
    const { container } = render(
      <ParticleBurst ref={ref} color="red" spacingFromCenter="8px" disabled />,
    );
    act(() => ref.current?.trigger());
    expect(container.querySelectorAll('.akds-particle-burst__burst')).toHaveLength(0);
  });

  it('stops spawning bursts once disabled becomes true', () => {
    const ref = React.createRef<ParticleBurstHandle>();
    const { container, rerender } = render(
      <ParticleBurst ref={ref} color="red" spacingFromCenter="8px" disabled={false} />,
    );
    act(() => ref.current?.trigger());
    expect(container.querySelectorAll('.akds-particle-burst__burst')).toHaveLength(1);

    rerender(<ParticleBurst ref={ref} color="red" spacingFromCenter="8px" disabled />);
    act(() => ref.current?.trigger());
    expect(container.querySelectorAll('.akds-particle-burst__burst')).toHaveLength(1);
  });

  it('supports multiple concurrent bursts', () => {
    const ref = React.createRef<ParticleBurstHandle>();
    const { container } = render(<ParticleBurst ref={ref} color="red" spacingFromCenter="8px" />);
    act(() => ref.current?.trigger());
    act(() => ref.current?.trigger());
    act(() => ref.current?.trigger());
    expect(container.querySelectorAll('.akds-particle-burst__burst')).toHaveLength(3);
  });

  it('removes a burst when its animation ends', () => {
    const ref = React.createRef<ParticleBurstHandle>();
    const { container } = render(<ParticleBurst ref={ref} color="red" spacingFromCenter="8px" />);
    act(() => ref.current?.trigger());
    act(() => ref.current?.trigger());
    const bursts = container.querySelectorAll('.akds-particle-burst__burst');
    expect(bursts).toHaveLength(2);

    fireAnimationEnd(bursts[0]!);
    expect(container.querySelectorAll('.akds-particle-burst__burst')).toHaveLength(1);
  });

  it('exposes only the trigger method on the ref handle', () => {
    const ref = React.createRef<ParticleBurstHandle>();
    render(<ParticleBurst ref={ref} color="red" spacingFromCenter="8px" />);
    expect(typeof ref.current?.trigger).toBe('function');
  });
});
