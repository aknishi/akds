import { NavLink } from 'react-router';
import { motion } from 'framer-motion';
import { Button, Flexbox, Tag, Text } from '@aknishi/akds-reactkit';
import { GradientBackground } from '../GradientBackground';
import { PageContainer } from '../../layout/PageContainer';
import { staggerContainer, staggerItem } from '../../../lib/motion';
import './Hero.css';

const TRUST_TAGS = ['27 components', 'Two-layer tokens', 'Built-in dark mode', 'Accessible by default'];

export function Hero() {
  return (
    <div className="hero">
      <GradientBackground />
      <PageContainer className="hero__content">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={staggerItem}>
            <Text as="h1" styleAs="hero" className="site-hero-title">
              A design system built for design, product, and engineering.
            </Text>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Text styleAs="body" className="hero__subhead">
              AKDS pairs a themeable React component library with a two-layer token architecture and an accessible
              icon set — so every team ships the same interface, without redrawing it every time.
            </Text>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Flexbox gap="md" wrap mt={4}>
              <NavLink to="/getting-started">
                <Button appearance="solid" emphasis="accented" size="lg">
                  Get started
                </Button>
              </NavLink>
              <NavLink to="/components">
                <Button appearance="bordered" emphasis="neutral" size="lg">
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
      </PageContainer>
    </div>
  );
}
