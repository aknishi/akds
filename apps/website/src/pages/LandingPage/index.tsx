import { NavLink } from 'react-router';
import { Avatar, Button, Card, CardContent, Flexbox, Switch, Tabs, TabList, Tab, Tag, Text, TextInput, Tooltip } from '@aknishi/akds-reactkit';
import { Hero } from '../../components/marketing/Hero';
import { Section } from '../../components/marketing/Section';
import { ShowcaseMarquee } from '../../components/marketing/ShowcaseMarquee';
import { FeatureGrid } from '../../components/marketing/FeatureGrid';
import { TokenTeaser } from '../../components/marketing/TokenTeaser';
import { PackageCard } from '../../components/marketing/PackageCard';
import { ComponentCard } from '../../components/docs/ComponentCard';
import { packages } from '../../content/packages';
import './LandingPage.css';
import '../../styles/gradients.css';

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
    name: 'TextInput',
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
    slug: 'dialog',
    name: 'Dialog',
    description: 'Modal dialog with configurable sizes.',
    preview: (
      <Button appearance="bordered" emphasis="neutral">
        Open dialog
      </Button>
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
      <Tooltip content="Helpful context">
        <Button appearance="transparent" emphasis="neutral">
          Hover me
        </Button>
      </Tooltip>
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
  return (
    <>
      <Hero />

      <Section className="landing-marquee-section">
        <Text styleAs="caption" className="landing-section__eyebrow">
          Built with real akds components
        </Text>
        <ShowcaseMarquee />
      </Section>

      <Section>
        <Flexbox direction="column" gap="sm" className="landing-section__intro">
          <Text as="h2" styleAs="h2">
            Why teams standardize on AKDS
          </Text>
        </Flexbox>
        <div className="landing-section__spacer" />
        <FeatureGrid />
      </Section>

      <Section>
        <TokenTeaser />
      </Section>

      <Section>
        <Flexbox justify="space-between" align="baseline" wrap gap="md" className="landing-section__intro">
          <Text as="h2" styleAs="h2">
            27 components, one design language
          </Text>
          <NavLink to="/components" className="landing-section__cta-link">
            View all components →
          </NavLink>
        </Flexbox>
        <div className="landing-section__spacer" />
        <div className="landing-components-grid">
          {COMPONENT_PREVIEWS.map((item) => (
            <ComponentCard key={item.slug} slug={item.slug} name={item.name} description={item.description} preview={item.preview} />
          ))}
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
            <PackageCard key={pkg.name} pkg={pkg} />
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
            <NavLink key={link.to} to={link.to} className="landing-guidelines-grid__link">
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
          ))}
        </div>
      </Section>

      <section className="landing-cta gradient-band">
        <Flexbox direction="column" align="center" gap="md" mx="auto" px="lg" className="landing-cta__content">
          <Text as="h2" styleAs="h2" className="landing-cta__title">
            Ready to build with AKDS?
          </Text>
          <Flexbox gap="md" wrap justify="center">
            <NavLink to="/getting-started">
              <Button appearance="solid" emphasis="neutral">
                Get started
              </Button>
            </NavLink>
            <a href="https://github.com/aknishi/akds" target="_blank" rel="noreferrer">
              <Button appearance="bordered" emphasis="neutral" className="landing-cta__github-button">
                View on GitHub
              </Button>
            </a>
          </Flexbox>
        </Flexbox>
      </section>
    </>
  );
}
