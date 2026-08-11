import { NavLink } from 'react-router';
import { Button, Card, CardContent, Divider, Flexbox, IconButton, Spinner, Text } from '@aknishi/akds-reactkit';
import { SettingsIcon } from '@aknishi/akds-icons';
import { CodeBlock } from '../../components/docs/CodeBlock';
import { ComponentPreviewFrame } from '../../components/docs/ComponentPreviewFrame';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';
import './GuidelinesAccessibilityPage.css';


function ReducedMotionStatus() {
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <Text styleAs="body">
      Your OS is currently set to{' '}
      <strong>{prefersReducedMotion ? 'reduce motion' : 'allow motion'}</strong> — this page's animations,
      including the landing page's gradient hero and marquee, respond to that setting live.
    </Text>
  );
}

export function GuidelinesAccessibilityPage() {
  return (
    <Flexbox direction="column" gap="xl" className="a11y-guidelines-page">
      <Flexbox direction="column" gap="sm">
        <Text as="h1" styleAs="h1">
          Accessibility guidelines
        </Text>
        <Text styleAs="body" className="a11y-guidelines-page__lede">
          Accessibility is a baseline requirement for every akds component, not an afterthought. These are the
          patterns every component in this library follows.
        </Text>
      </Flexbox>

      <section>
        <Text as="h2" styleAs="h3">
          Color &amp; contrast
        </Text>
        <Text styleAs="body" className="a11y-guidelines-page__section-lede">
          Semantic text and background token pairs are chosen to meet WCAG contrast requirements. See the full
          palette on the <NavLink to="/tokens">token architecture</NavLink> page.
        </Text>
      </section>

      <Divider />

      <section>
        <Text as="h2" styleAs="h3">
          Keyboard &amp; focus
        </Text>
        <Text styleAs="body" className="a11y-guidelines-page__section-lede">
          Every interactive element is reachable and operable by keyboard alone. Focus is never hidden — a visible{' '}
          <code>:focus-visible</code> ring, styled from <code>--akds-outline-focus</code>, is required on every
          focusable element and is never removed without an equivalent replacement.
        </Text>
      </section>

      <Divider />

      <section>
        <Text as="h2" styleAs="h3">
          Focus management for disabled controls
        </Text>
        <Text styleAs="body" className="a11y-guidelines-page__section-lede">
          A disabled control that disappears from the tab order can be confusing — screen reader users may not know
          it exists at all. <code>focusableWhenDisabled</code> keeps it discoverable.
        </Text>
        <ComponentPreviewFrame>
          <Button disabled focusableWhenDisabled emphasis="accented">
            Focusable while disabled
          </Button>
        </ComponentPreviewFrame>
        <CodeBlock
          code={`<Button disabled focusableWhenDisabled emphasis="accented">
  Focusable while disabled
</Button>

// Renders aria-disabled="true" instead of the native disabled
// attribute, and blocks the click handler via preventDefault().`}
        />
      </section>

      <Divider />

      <section>
        <Text as="h2" styleAs="h3">
          Loading &amp; async state
        </Text>
        <Text styleAs="body" className="a11y-guidelines-page__section-lede">
          Loading buttons set <code>aria-busy="true"</code> and visually replace their content with a{' '}
          <code>Spinner</code>, which itself renders <code>aria-hidden</code> so the busy state — not a
          meaningless spinner icon — is what gets announced.
        </Text>
        <ComponentPreviewFrame>
          <IconButton appearance="solid" emphasis="accented" loading aria-label="Loading settings">
            <SettingsIcon />
          </IconButton>
          <Card>
            <CardContent>
              <Flexbox align="center" gap="sm">
                <Spinner size="sm" />
                <Text styleAs="body">Standalone Spinner — pair with aria-busy on its container.</Text>
              </Flexbox>
            </CardContent>
          </Card>
        </ComponentPreviewFrame>
      </section>

      <Divider />

      <section>
        <Text as="h2" styleAs="h3">
          Labeling rules
        </Text>
        <Flexbox direction="column" gap="sm">
          <Text styleAs="body">
            Use <code>aria-label</code> or <code>aria-labelledby</code> when an element has no visible text label
            (e.g. IconButton). Use <code>aria-describedby</code> to associate helper or error text with an input.
          </Text>
          <CodeBlock
            code={`// Boolean ARIA attributes are omitted entirely when falsy —
// never rendered as aria-disabled="false".
aria-disabled={isDisabled || undefined}
aria-busy={loading || undefined}`}
          />
        </Flexbox>
      </section>

      <Divider />

      <section>
        <Text as="h2" styleAs="h3">
          Motion &amp; animation
        </Text>
        <Card>
          <CardContent>
            <ReducedMotionStatus />
          </CardContent>
        </Card>
      </section>

      <Divider />

      <section>
        <Text as="h2" styleAs="h3">
          Testing &amp; tooling
        </Text>
        <Text styleAs="body" className="a11y-guidelines-page__section-lede">
          Every reactkit component ships with an automated <code>axe accessibility</code> test suite covering its
          default state and every meaningful variant (disabled, loading, error) — accessibility regressions fail CI,
          they don't ship silently.
        </Text>
      </section>

      <Divider />

      <section>
        <Text as="h2" styleAs="h3">
          Reporting an issue
        </Text>
        <Text styleAs="body" className="a11y-guidelines-page__section-lede">
          Found an accessibility gap? Open an issue on{' '}
          <a href="https://github.com/aknishi/akds" target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </Text>
      </section>
    </Flexbox>
  );
}
