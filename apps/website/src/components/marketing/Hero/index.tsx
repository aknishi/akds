import React from 'react';
import { NavLink } from 'react-router';
import { motion, type Variants } from 'framer-motion';
import { Button, Flexbox, Tag, Text } from '@aknishi/akds-reactkit';
import { GradientBackground } from '../GradientBackground';
import { HeroShatter } from './HeroShatter';
import { PageContainer } from '../../layout/PageContainer';
import { useMediaQuery } from '../../../lib/useMediaQuery';
import { componentRegistry } from '../../../content/components/registry';
import heroLogo from './Hero_AKLogo.png';
import './Hero.css';

const TRUST_TAGS = [
  `${componentRegistry.length} components`,
  'Two-layer tokens',
  'Built-in dark mode',
  'Accessible by default',
];

// A transition defined inside a variant's own "visible" state overrides a `transition`
// prop passed to the component (for both the component itself and, for a child, any
// orchestration delay computed by the parent) — so delayChildren/staggerChildren and the
// slower per-item duration both have to live inside the variants themselves, not as props.
const heroStaggerContainer: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.5, staggerChildren: 0.1 } },
};

const heroStaggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

interface HeroProps {
  /** Called once the shatter intro has fully finished and the hero content is revealed. */
  onShatterComplete?: () => void;
}

export function Hero({ onShatterComplete }: HeroProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const ctaSize = isDesktop ? 'lg' : 'md';
  const [contentReady, setContentReady] = React.useState(false);

  return (
    <div className="hero">
      <GradientBackground visible={contentReady} />
      <HeroShatter
        onReveal={() => {
          setContentReady(true);
          onShatterComplete?.();
        }}
      />
      <PageContainer className="hero__content">
        <div className="hero__grid">
          <motion.div
            variants={heroStaggerContainer}
            initial="hidden"
            animate={contentReady ? 'visible' : 'hidden'}
            className="hero__text"
          >
            <motion.div variants={heroStaggerItem}>
              <h1 className="hero__logo">
                <img src={heroLogo} alt="" className="hero__logo-image" />
                <span className="hero__logo-tagline">
                  <span className="hero__logo-word">Design</span>
                  <span className="hero__logo-word">System</span>
                </span>
              </h1>
            </motion.div>

            <motion.div variants={heroStaggerItem}>
              <Text styleAs="body" className="hero__subhead">
                A scalable design system that thinks through the details. AKDS pairs a themeable React component
                library with a two-layer token architecture. It provides consistency without compromising in user experience.
              </Text>
            </motion.div>

            <motion.div variants={heroStaggerItem}>
              <Flexbox gap="md" wrap mt={4}>
                <NavLink to="/getting-started">
                  <Button appearance="solid" emphasis="accented" size={ctaSize}>
                    Get started
                  </Button>
                </NavLink>
                <NavLink to="/components">
                  <Button appearance="transparent" emphasis="neutral" size={ctaSize}>
                    Browse components
                  </Button>
                </NavLink>
              </Flexbox>
            </motion.div>

            <motion.div variants={heroStaggerItem}>
              <Flexbox gap="sm" wrap mt={5}>
                {TRUST_TAGS.map((tag) => (
                  <Tag key={tag} variant="info">
                    {tag}
                  </Tag>
                ))}
              </Flexbox>
            </motion.div>
          </motion.div>

          <div className={`hero__visual${contentReady ? ' hero__visual--visible' : ''}`}>
            <img src="/hero-components.png" alt="" aria-hidden="true" className="hero__visual-image" />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
