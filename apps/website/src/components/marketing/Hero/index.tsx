import { NavLink } from 'react-router';
import { motion } from 'framer-motion';
import { Button, Flexbox, Tag, Text } from '@aknishi/akds-reactkit';
import { GradientBackground } from '../GradientBackground';
import { PageContainer } from '../../layout/PageContainer';
import { staggerContainer, staggerItem } from '../../../lib/motion';
import { useMediaQuery } from '../../../lib/useMediaQuery';
import { componentRegistry } from '../../../content/components/registry';
import './Hero.css';

const TRUST_TAGS = [
  `${componentRegistry.length} components`,
  'Two-layer tokens',
  'Built-in dark mode',
  'Accessible by default',
];

export function Hero() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const ctaSize = isDesktop ? 'lg' : 'md';

  return (
    <div className="hero">
      <GradientBackground />
      <PageContainer className="hero__content">
        <div className="hero__grid">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="hero__text">
            <motion.div variants={staggerItem}>
              <Text as="h1" styleAs="hero" className="site-hero-title">
                A scalable design system that thinks through the details, so your users don't have to.
              </Text>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Text styleAs="body" className="hero__subhead">
                AKDS pairs a themeable React component library with a two-layer token architecture and an accessible
                icon set — so every team ships with consistency and fast without compromising user experience.
              </Text>
            </motion.div>

            <motion.div variants={staggerItem}>
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

            <motion.div variants={staggerItem}>
              <Flexbox gap="sm" wrap mt={5}>
                {TRUST_TAGS.map((tag) => (
                  <Tag key={tag} variant="info">
                    {tag}
                  </Tag>
                ))}
              </Flexbox>
            </motion.div>
          </motion.div>

          <div className="hero__visual">
            <img src="/hero-components.png" alt="" aria-hidden="true" className="hero__visual-image" />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
