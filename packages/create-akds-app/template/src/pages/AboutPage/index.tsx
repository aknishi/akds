import React from 'react';
import { useNavigate } from 'react-router';
import { Button, Card, CardContent, Text, Flexbox } from '@aknishi/akds-reactkit';
import './AboutPage.css';

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <main className="about">
      <Text styleAs="h1" as="h1">
        About
      </Text>
      <Text styleAs="body" as="p" className="about__intro">
        This is a starter app scaffolded with{' '}
        <code>create-akds-app</code>. Edit this page at{' '}
        <code>src/pages/AboutPage/index.tsx</code>.
      </Text>

      <Card className="about__card">
        <CardContent>
          <Flexbox direction="column" gap="sm">
            <Text styleAs="h4" as="h2">
              What's included
            </Text>
            <ul className="about__list">
              <li>TypeScript + React 18 + Vite</li>
              <li>React Router v7 — file-based routing in router.tsx</li>
              <li>@aknishi/akds-reactkit — full component library</li>
              <li>@aknishi/akds-icons — icon set</li>
              <li>@aknishi/akds-tokens — design tokens via CSS variables</li>
              <li>ThemeProvider with light/dark toggle</li>
            </ul>
          </Flexbox>
        </CardContent>
      </Card>

      <Button appearance="transparent" emphasis="neutral" onClick={() => navigate('/')}>
        ← Back to home
      </Button>
    </main>
  );
}
