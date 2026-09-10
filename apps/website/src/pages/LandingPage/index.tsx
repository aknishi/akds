import React from 'react';
import { NavLink } from 'react-router';
import { motion, type Variants } from 'framer-motion';
import { AIButton, Avatar, Button, Card, CardContent, Flexbox, IconButton, StreamingText, Switch, Tabs, TabList, Tab, Tag, Text, TextInput, Tooltip, ThemeProvider } from '@aknishi/akds-reactkit';
import { CopyIcon, ChevronRightIcon } from '@aknishi/akds-icons';
import { Hero } from '../../components/marketing/Hero';
import { GradientBackground } from '../../components/marketing/GradientBackground';
import { Section } from '../../components/marketing/Section';
import { ShowcaseMarquee } from '../../components/marketing/ShowcaseMarquee';
import { FeatureGrid } from '../../components/marketing/FeatureGrid';
import { TokenTeaser } from '../../components/marketing/TokenTeaser';
import { PackageCard } from '../../components/marketing/PackageCard';
import { ComponentCard } from '../../components/docs/ComponentCard';
import { packages } from '../../content/packages';
import { componentRegistry } from '../../content/components/registry';
import './LandingPage.css';
import '../../styles/gradients.css';

// A transition defined inside a variant's own "visible" state overrides a `transition`
// prop passed to the component, so the extra delay has to live inside the variant
// itself — fadeUp's own visible.transition already sets duration/ease, and a prop-level
// override would be silently discarded.
const marqueeReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 1 } },
};

// Auto-restarts once the stream finishes — this card preview has no
// user-facing restart control. onComplete fires from StreamingText's own
// internal timer, not a React effect, so the pending restart timeout is
// tracked in a ref and cleared on unmount to avoid a state update after the
// card is gone.
function StreamingTextAutoLoopPreview({ text, speed, pauseMs = 1500 }: { text: string; speed?: number; pauseMs?: number }) {
  const [key, setKey] = React.useState(0);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleComplete = React.useCallback(() => {
    timeoutRef.current = setTimeout(() => setKey((k) => k + 1), pauseMs);
  }, [pauseMs]);

  return <StreamingText key={key} text={text} speed={speed} onComplete={handleComplete} />;
}

const COMPONENT_PREVIEWS = [
  {
    slug: 'button',
    name: 'Button',
    description: 'Solid, transparent, and bordered appearances.',
    preview: (
      <Button appearance="solid" emphasis="accented">
        Button
      </Button>
    ),
  },
  {
    slug: 'text-input',
    name: 'Text input',
    description: 'Floating label, helper text, adornments.',
    preview: <TextInput label="Email" />,
  },
  {
    slug: 'switch',
    name: 'Switch',
    description: 'Accessible toggle with label support.',
    preview: <Switch label="Enabled" defaultChecked />,
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    description: 'Compound tab state with context.',
    preview: (
      <Tabs defaultActiveTab="one">
        <TabList>
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
      </Tabs>
    ),
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    description: 'Image, initials, or icon fallback.',
    preview: <Avatar name="Grace Hopper" />,
  },
  {
    slug: 'tag',
    name: 'Tag',
    description: 'Status and label chips, dismissible.',
    preview: <Tag variant="info">In progress</Tag>,
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    description: 'Hover and focus tooltips on any trigger.',
    preview: (
      // Margin nudges the whole (icon + pill) unit down for vertical centering — it
      // goes on a wrapper outside Tooltip, not on the trigger, because margin on the
      // trigger inflates Tooltip's own auto-sized wrapper and detaches the pill from it.
      <div style={{ marginTop: 'var(--akds-spacing-200)' }}>
        <Tooltip content="Copy" open>
          <IconButton appearance="transparent" emphasis="neutral" aria-label="Copy">
            <CopyIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
  },
  {
    slug: 'ai-button',
    name: 'AI button',
    description: 'Triggers AI generation with an animated loading state.',
    preview: <AIButton loading>Generate</AIButton>,
  },
  {
    slug: 'streaming-text',
    name: 'Streaming text',
    description: 'Reveals text one character at a time, like an AI response arriving live.',
    // Width relative to the card's own preview area (not the revealed text)
    // so the block never grows/shifts sideways as the text streams in.
    preview: (
      <div style={{ width: '100%' }}>
        <StreamingTextAutoLoopPreview text="Watch responses arrive one character at a time, just like a real AI is typing them out." speed={80} />
      </div>
    ),
  },
];

const GUIDELINE_LINKS = [
  {
    to: '/guidelines/design',
    title: 'Design guidelines',
    description: 'Principles, color, typography, spacing, and elevation usage across every surface.',
  },
  {
    to: '/guidelines/accessibility',
    title: 'Accessibility guidelines',
    description: 'Keyboard support, focus management, ARIA patterns, and motion preferences.',
  },
];

export function LandingPage() {
  const [heroRevealed, setHeroRevealed] = React.useState(false);

  return (
    <>
      <Hero onShatterComplete={() => setHeroRevealed(true)} />

      <Section className="landing-marquee-section">
        <motion.div variants={marqueeReveal} initial="hidden" animate={heroRevealed ? 'visible' : 'hidden'}>
          <ShowcaseMarquee />
        </motion.div>
      </Section>

      <Section animated>
        <TokenTeaser />
      </Section>

      <Section>
        <Flexbox direction="column" gap="sm" className="landing-section__intro">
          <Text as="h2" styleAs="h2">
            Features
          </Text>
        </Flexbox>
        <div className="landing-section__spacer" />
        <FeatureGrid />
      </Section>

      <Section>
        <Flexbox direction="column" gap="sm" className="landing-section__intro">
          <Text as="h2" styleAs="h2">
            {componentRegistry.length} components, one design language
          </Text>
        </Flexbox>
        <div className="landing-section__spacer" />
        <div className="landing-components-grid">
          {COMPONENT_PREVIEWS.map((item) => (
            <div key={item.slug} className="landing-components-grid__item">
              <ComponentCard slug={item.slug} name={item.name} description={item.description} preview={item.preview} />
            </div>
          ))}
          <div className="landing-components-grid__item">
            <NavLink to="/components" className="component-card-link">
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.15 }}>
                <Card className="component-card landing-view-all-card">
                  <Text as="span" styleAs="h5" className="landing-view-all-card__text">
                    View all components catalog &rarr;
                  </Text>
                </Card>
              </motion.div>
            </NavLink>
          </div>
        </div>
      </Section>

      <Section>
        <Flexbox direction="column" gap="sm" className="landing-section__intro">
          <Text as="h2" styleAs="h2">
            Four packages, one monorepo
          </Text>
        </Flexbox>
        <div className="landing-section__spacer" />
        <div className="landing-packages-grid">
          {packages.map((pkg) => (
            <div key={pkg.name} className="landing-packages-grid__item">
              <PackageCard pkg={pkg} />
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Flexbox direction="column" gap="sm" className="landing-section__intro">
          <Text as="h2" styleAs="h2">
            Built the same way, documented the same way
          </Text>
        </Flexbox>
        <div className="landing-section__spacer" />
        <div className="landing-guidelines-grid">
          {GUIDELINE_LINKS.map((link) => (
            <div key={link.to} className="landing-guidelines-grid__item">
              <NavLink to={link.to} className="landing-guidelines-grid__link">
                <Card className="landing-guidelines-grid__card">
                  <CardContent>
                    <Text as="h3" styleAs="h4">
                      {link.title}
                    </Text>
                    <Text styleAs="body" className="landing-guidelines-grid__description">
                      {link.description}
                    </Text>
                  </CardContent>
                </Card>
              </NavLink>
            </div>
          ))}
        </div>
      </Section>

      <section className="landing-cta">
        <GradientBackground />
        <Flexbox direction="column" align="center" gap="md" mx="auto" px="lg" className="landing-cta__content">
          <Text as="h2" styleAs="h2">
            Ready to build with AKDS?
          </Text>
          <Flexbox gap="md" wrap justify="center">
            <NavLink to="/getting-started">
              <Button appearance="solid" emphasis="accented">
                Get started
              </Button>
            </NavLink>
            <a href="https://github.com/aknishi/akds" target="_blank" rel="noreferrer">
              <Button appearance="bordered" emphasis="neutral">
                View on GitHub
              </Button>
            </a>
          </Flexbox>
        </Flexbox>
      </section>
    </>
  );
}
