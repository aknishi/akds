import React from 'react';
import './ParticleBurst.css';
import { makePrefixer } from '../../utils';

const withBaseName = makePrefixer('akds-particle-burst');

interface Burst {
  id: number;
}

let nextId = 0;

export interface ParticleBurstHandle {
  /** Spawns a new burst of particles from the center of the host. */
  trigger(): void;
}

export interface ParticleBurstProps {
  /** Color of the particles. Accepts any valid CSS color value, including design tokens. */
  color: string;
  /** Distance each particle starts from the center before animating outward. */
  spacingFromCenter: string;
  /** Number of particles spawned per burst. */
  particleCount?: number;
  /** Whether particle bursts should be suppressed (e.g. reduced motion). */
  disabled?: boolean;
}

/**
 * Headless particle-burst layer. Place inside any `position: relative` container.
 * Hold a ref and call `ref.current.trigger()` to spawn a burst of small circular
 * particles that explode outward from the center and fade out.
 *
 * @example
 * const burstRef = React.useRef<ParticleBurstHandle>(null);
 * <button onClick={() => burstRef.current?.trigger()}>
 *   Label
 *   <ParticleBurst
 *     ref={burstRef}
 *     color="var(--akds-color-background-error-default)"
 *     spacingFromCenter="var(--akds-spacing-50)"
 *   />
 * </button>
 */
export const ParticleBurst = React.forwardRef<ParticleBurstHandle, ParticleBurstProps>(
  function ParticleBurst({ color, spacingFromCenter, particleCount = 8, disabled = false }, ref) {
    const [bursts, setBursts] = React.useState<Burst[]>([]);

    React.useImperativeHandle(ref, () => ({
      trigger() {
        if (disabled) return;
        setBursts(prev => [...prev, { id: nextId++ }]);
      },
    }), [disabled]);

    const removeBurst = (id: number) =>
      setBursts(prev => prev.filter(b => b.id !== id));

    return (
      <span
        aria-hidden="true"
        className={withBaseName()}
        style={{
          '--particle-burst-color': color,
          '--particle-burst-spacing': spacingFromCenter,
        } as React.CSSProperties}
      >
        {bursts.map(b => (
          <span
            key={b.id}
            className={withBaseName.el('burst')}
            onAnimationEnd={() => removeBurst(b.id)}
          >
            {Array.from({ length: particleCount }).map((_, i) => (
              <span key={i} className={withBaseName.el('particle')} />
            ))}
          </span>
        ))}
      </span>
    );
  },
);

ParticleBurst.displayName = 'ParticleBurst';
