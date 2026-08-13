import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../../lib/usePrefersReducedMotion';
import '../../../styles/gradients.css';

const DRIFT = {
  x: [0, 30, 0],
  y: [0, -20, 0],
};

export function GradientBackground() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="gradient-background" aria-hidden="true">
      <div className="gradient-background__base" />
      <motion.div
        className="gradient-background__blob gradient-background__blob--primary"
        animate={prefersReducedMotion ? undefined : DRIFT}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="gradient-background__blob gradient-background__blob--info"
        animate={prefersReducedMotion ? undefined : { x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="gradient-background__blob gradient-background__blob--accent"
        animate={prefersReducedMotion ? undefined : { x: [0, 20, 0], y: [0, 15, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
