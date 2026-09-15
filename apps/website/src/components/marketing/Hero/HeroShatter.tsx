import React from 'react';
import { createPortal } from 'react-dom';
import { usePrefersReducedMotion } from '../../../lib/usePrefersReducedMotion';
import './HeroShatter.css';

const COLUMN_WIDTHS = [16, 14, 20, 12, 18, 20];
const ROW_HEIGHTS = [28, 24, 26, 22];

const TILE_COLORS = [
  'var(--akds-color-background-primary-default)',
  'var(--akds-color-background-info-default)',
  'var(--akds-primitive-color-purple-400)',
  'var(--akds-primitive-color-blue-200)',
];

// Each tile runs its own copy of the same keyframe animation (see HeroShatter.css),
// offset only by --hero-shatter-delay. The keyframes hold every tile fully arrived
// (opacity/transform unchanged) between the 35% and 60% keyframe stops of its own
// timeline — as long as the largest delay stays under that hold window, there's a
// guaranteed moment where the whole grid is simultaneously in place as one solid layer
// before any tile starts dissolving, with no shared "wait for the slowest tile" state
// that would otherwise read as the animation pausing.
const TOTAL_DURATION = 1700;
const ARRIVE_FRACTION = 0.35;
const DELAY_DISTANCE_FACTOR = 50;
const DELAY_RANDOM_RANGE = 80;
const DONE_BUFFER = 60;

interface Tile {
  key: string;
  top: number;
  left: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
  rotate: number;
  delay: number;
  color: string;
}

function buildTiles(): Tile[] {
  const centerRow = (ROW_HEIGHTS.length - 1) / 2;
  const centerCol = (COLUMN_WIDTHS.length - 1) / 2;
  const tiles: Tile[] = [];
  let top = 0;

  ROW_HEIGHTS.forEach((height, rowIndex) => {
    let left = 0;
    COLUMN_WIDTHS.forEach((width, colIndex) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 55 + Math.random() * 45;
      const distanceFromCenter = Math.hypot(rowIndex - centerRow, colIndex - centerCol);

      tiles.push({
        key: `${rowIndex}-${colIndex}`,
        top,
        left,
        width,
        height,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        rotate: (Math.random() - 0.5) * 70,
        delay: distanceFromCenter * DELAY_DISTANCE_FACTOR + Math.random() * DELAY_RANDOM_RANGE,
        color: TILE_COLORS[(rowIndex + colIndex) % TILE_COLORS.length],
      });

      left += width;
    });
    top += height;
  });

  return tiles;
}

interface HeroShatterProps {
  /** Called once every tile has arrived, so the real hero content can start appearing while the layer is still whole. */
  onReveal: () => void;
}

export function HeroShatter({ onReveal }: HeroShatterProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [tiles] = React.useState(buildTiles);
  const [visible, setVisible] = React.useState(true);
  const [ready, setReady] = React.useState(false);

  // Wait for fonts to finish loading, then a couple of frames for layout/paint to settle,
  // before rendering any tiles or starting the reveal timers below. On a cold first visit
  // (uncached CSS/JS/fonts), React can mount and start wall-clock setTimeouts before the
  // browser has actually settled into its final layout — the JS timers would then fire on
  // a schedule that assumes the CSS animation started at roughly the same moment, when it
  // may not have. Gating on this removes that race instead of guessing at a fixed delay.
  React.useEffect(() => {
    let cancelled = false;

    const settle = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) setReady(true);
        });
      });
    };

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(settle);
    } else {
      settle();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!ready) return;

    if (prefersReducedMotion) {
      onReveal();
      setVisible(false);
      return;
    }

    const maxDelay = Math.max(...tiles.map((tile) => tile.delay));
    const revealTimer = window.setTimeout(onReveal, maxDelay + ARRIVE_FRACTION * TOTAL_DURATION);
    const doneTimer = window.setTimeout(() => setVisible(false), maxDelay + TOTAL_DURATION + DONE_BUFFER);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(doneTimer);
    };
    // onReveal forwards to a stable state setter — intentionally excluded so this
    // one-shot mount sequence isn't restarted by a new closure identity each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, prefersReducedMotion, tiles]);

  if (!visible || !ready) return null;

  // Portaled straight to <body> so this fixed-position overlay is positioned
  // relative to the true viewport. SiteShell wraps every route in a motion.div
  // that animates `y` for the page-enter transition — Framer Motion leaves that
  // transform applied as an inline style even after it settles at y:0, and any
  // ancestor transform (including translateY(0)) creates a new containing block
  // for `position: fixed` descendants, which would otherwise offset `top: 64px`
  // from that div's box instead of the viewport.
  return createPortal(
    <div className="hero-shatter" aria-hidden="true">
      {tiles.map((tile) => (
        <div
          key={tile.key}
          className="hero-shatter__tile"
          style={
            {
              top: `${tile.top}%`,
              left: `${tile.left}%`,
              width: `${tile.width}%`,
              height: `${tile.height}%`,
              background: tile.color,
              '--hero-shatter-dx': `${tile.dx}%`,
              '--hero-shatter-dy': `${tile.dy}%`,
              '--hero-shatter-rotate': `${tile.rotate}deg`,
              '--hero-shatter-delay': `${tile.delay}ms`,
              '--hero-shatter-duration': `${TOTAL_DURATION}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>,
    document.body,
  );
}
