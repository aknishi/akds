import React from 'react';
import './RippleBase.css';
import { makePrefixer } from '../../utils/makePrefixer';
import clsx from 'clsx';

const withBaseName = makePrefixer('akds-ripple-base');

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

let nextId = 0;

export interface RippleBaseHandle {
  /** Call from the host's onPointerDown to spawn a ripple at the event coordinates. */
  trigger(e: React.PointerEvent | PointerEvent): void;
}

export interface RippleBaseProps {
  /** Whether ripples should be suppressed (e.g. when the host element is disabled). */
  disabled?: boolean;
  /** Whether the ripple base is placed on a dark background. */
  onDark?: boolean;

}

/**
 * Headless ripple layer. Place inside any `position: relative` container.
 * Hold a ref and call `ref.current.trigger(e)` from the host's `onPointerDown`.
 *
 * The host element does NOT need `overflow: hidden` — the ripple base clips itself.
 *
 * @example
 * const rippleRef = React.useRef<RippleBaseHandle>(null);
 * <button onPointerDown={e => rippleRef.current?.trigger(e)}>
 *   Label
 *   <RippleBase ref={rippleRef} disabled={isDisabled} />
 * </button>
 */
export const RippleBase = React.forwardRef<RippleBaseHandle, RippleBaseProps>(
  function RippleBase({ disabled = false, onDark = false }, ref) {
    const containerRef = React.useRef<HTMLSpanElement>(null);
    const [ripples, setRipples] = React.useState<Ripple[]>([]);

    React.useImperativeHandle(ref, () => ({
      trigger(e: React.PointerEvent | PointerEvent) {
        if (disabled) return;
        const el = containerRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const size = 2 * Math.max(
          Math.hypot(x, y),
          Math.hypot(rect.width - x, y),
          Math.hypot(x, rect.height - y),
          Math.hypot(rect.width - x, rect.height - y),
        );

        setRipples(prev => [...prev, { id: nextId++, x, y, size }]);
      },
    }), [disabled]);

    const removeRipple = (id: number) =>
      setRipples(prev => prev.filter(r => r.id !== id));

    return (
      <span ref={containerRef} aria-hidden="true" className={clsx(withBaseName(), { [withBaseName('ondark')]: onDark })}>
        {ripples.map(r => (
          <span
            key={r.id}
            className={withBaseName('ripple')}
            style={{
              width: r.size,
              height: r.size,
              left: r.x - r.size / 2,
              top: r.y - r.size / 2,
            }}
            onAnimationEnd={() => removeRipple(r.id)}
          />
        ))}
      </span>
    );
  },
);

RippleBase.displayName = 'RippleBase';
