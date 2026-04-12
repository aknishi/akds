import React from 'react';
import { useNavigate } from 'react-router';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Text,
  Flexbox,
} from '@aknishi/akds-reactkit';
import { SpeedIcon, PaletteIcon, FlashIcon, FavoriteFilledIcon, FavoriteIcon } from '@aknishi/akds-icons';
import './LandingPage.css';

const features = [
  {
    icon: <SpeedIcon className="feature-card__icon" aria-hidden="true" />,
    title: 'Fast by default',
    description:
      'Powered by Vite — instant server start, lightning-fast HMR, and optimised production builds out of the box.',
  },
  {
    icon: <PaletteIcon className="feature-card__icon" aria-hidden="true" />,
    title: 'Design system included',
    description:
      'Every component comes from @aknishi/akds-reactkit, fully token-driven with built-in dark mode support.',
  },
  {
    icon: <FlashIcon className="feature-card__icon" aria-hidden="true" />,
    title: 'Routing ready',
    description:
      'React Router v7 is wired up from the start. Add new pages in router.tsx and go.',
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [likes, setLikes] = React.useState(0);

  return (
    <main className="landing">
      {/* ── Hero ── */}
      <section className="landing__hero">
        <Text styleAs="hero" as="h1" className="landing__hero-title">
          Build faster with akds
        </Text>
        <Text styleAs="body" as="p" className="landing__hero-subtitle">
          A ready-to-go TypeScript + React + Vite starter with the akds design system,
          routing, and dark mode baked in — so you can focus on what you're building.
        </Text>
        <Flexbox gap="sm" className="landing__hero-cta">
          <Button
            appearance="solid"
            emphasis="accented"
            size="lg"
            onClick={() => navigate('/about')}
          >
            Get started
          </Button>
          <Button
            appearance="bordered"
            emphasis="neutral"
            size="lg"
            onClick={() => window.open('https://www.akds-storybook.com', '_blank', 'noopener,noreferrer')}
          >
            View docs
          </Button>
        </Flexbox>
      </section>

      {/* ── Features ── */}
      <section className="landing__features" aria-label="Features">
        <Text styleAs="h2" as="h2" className="landing__section-title">
          Everything you need
        </Text>
        <div className="landing__feature-grid">
          {features.map((f) => (
            <Card key={f.title} className="feature-card">
              <CardHeader>
                {f.icon}
                <Text styleAs="h4" as="h3">
                  {f.title}
                </Text>
              </CardHeader>
              <CardContent>
                <Text styleAs="body" as="p" className="feature-card__description">
                  {f.description}
                </Text>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="landing__cta-strip">
        <Text styleAs="h3" as="h2">
          Ready to ship?
        </Text>
        <Text styleAs="body" as="p" className="landing__cta-strip-sub">
          Edit <code>src/pages/LandingPage</code> to make this page your own.
        </Text>
        <Button
          appearance="solid"
          emphasis="accented"
          size="md"
          onClick={() => setLikes((n) => n + 1)}
        >
          {likes > 0 ?
            <FavoriteFilledIcon aria-hidden="true" /> :
            <FavoriteIcon aria-hidden="true" />
          } 
          Like
        </Button>
        {likes > 0 && (
          <Text styleAs="caption" as="p" className="landing__cta-strip-sub">
            {likes} {likes === 1 ? 'like' : 'likes'}
          </Text>
        )}
      </section>
    </main>
  );
}
