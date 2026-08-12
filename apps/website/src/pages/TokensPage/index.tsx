import { primitiveColors, spacing, typography, elevation, breakpoints } from '@aknishi/akds-tokens';
import { Card, CardContent, Divider, Flexbox, Text } from '@aknishi/akds-reactkit';
import { CodeBlock } from '../../components/docs/CodeBlock';
import { TokenSwatch } from '../../components/docs/TokenSwatch';
import './TokensPage.css';

const PRIMITIVE_SCALES = Object.keys(primitiveColors).filter(
  (key) => key !== 'white' && key !== 'black',
) as Array<Exclude<keyof typeof primitiveColors, 'white' | 'black'>>;

const SEMANTIC_EXAMPLES = [
  { role: 'background-primary-default', description: 'Primary action fills (solid Button, links)' },
  { role: 'background-secondary-default', description: 'Neutral surfaces, secondary buttons' },
  { role: 'background-success-default', description: 'Success states' },
  { role: 'background-error-default', description: 'Destructive and error states' },
  { role: 'background-warning-default', description: 'Warning states' },
  { role: 'background-info-default', description: 'Informational accents' },
  { role: 'surface-default', description: 'Page background' },
  { role: 'surface-raised', description: 'Cards, menus, popovers' },
  { role: 'surface-sunken', description: 'Recessed panels, code blocks' },
  { role: 'text-primary-default', description: 'Primary body text' },
  { role: 'text-secondary-default', description: 'Secondary / muted text' },
  { role: 'border-neutral-default', description: 'Default borders and dividers' },
];

const ELEVATION_LEVELS = Object.keys(elevation).filter((key) => key !== 'none') as Array<
  Exclude<keyof typeof elevation, 'none'>
>;

export function TokensPage() {
  return (
    <Flexbox direction="column" gap="xl" className="tokens-page">
      <Flexbox direction="column" gap="sm">
        <Text as="h1" styleAs="h1">
          Token architecture
        </Text>
        <Text styleAs="body" className="tokens-page__lede">
          Every color, space, and type value in AKDS traces back to a token. Two layers keep the system both
          flexible and consistent: raw primitives, and the role-based semantic aliases that components actually
          consume.
        </Text>
      </Flexbox>

      <Flexbox as="section" direction="column" gap={1}>
        <Text as="h2" styleAs="h3">
          1. Primitive layer
        </Text>
        <Text styleAs="body" className="tokens-page__section-lede">
          Context-free color ramps — seven hues, eleven steps each (50–950) — plus white and black. Primitives never
          appear directly in component CSS.
        </Text>
        <Flexbox direction="column" gap="md">
          {PRIMITIVE_SCALES.map((scale) => (
            <div key={scale} className="tokens-page__scale-row">
              <Text styleAs="label" className="tokens-page__scale-name">
                {scale}
              </Text>
              <Flexbox gap="xs" wrap direction="row">
                {Object.keys(primitiveColors[scale]).map((step) => (
                  <div
                    key={step}
                    className="tokens-page__scale-swatch"
                    style={{ background: `var(--akds-primitive-color-${scale}-${step})` }}
                    title={`--akds-primitive-color-${scale}-${step}`}
                  />
                ))}
              </Flexbox>
            </div>
          ))}
        </Flexbox>
      </Flexbox>

      <Divider />

      <Flexbox as="section" direction="column" gap={1}>
        <Text as="h2" styleAs="h3">
          2. Semantic layer
        </Text>
        <Text styleAs="body" className="tokens-page__section-lede">
          Role-based tokens — background, surface, text, border, icon, interaction — each theme-aware, carrying a
          light and dark value under the same variable name. Components always consume semantic tokens.
        </Text>
        <div className="tokens-page__semantic-grid">
          {SEMANTIC_EXAMPLES.map((item) => (
            <TokenSwatch key={item.role} varName={`--akds-color-${item.role}`} label={item.description} />
          ))}
        </div>
      </Flexbox>

      <Divider />

      <Flexbox as="section" direction="column" gap={1}>
        <Text as="h2" styleAs="h3">
          3. Naming convention
        </Text>
        <Text styleAs="body" className="tokens-page__section-lede">
          Every custom property follows <code>--akds-{'{category}'}-{'{subcategory...}'}-{'{state?}'}</code>.
        </Text>
        <Card>
          <CardContent>
            <Flexbox direction="column" gap="xs">
              <CodeBlock language="css" code={'--akds-primitive-color-blue-500: #3B82F6;'} />
              <CodeBlock language="css" code={'--akds-color-background-primary-hover: #1D4ED8;'} />
              <CodeBlock language="css" code={'--akds-spacing-layout-md: 16px;'} />
              <CodeBlock language="css" code={'--akds-font-size-3xl: 32px;'} />
            </Flexbox>
          </CardContent>
        </Card>
      </Flexbox>

      <Divider />

      <Flexbox as="section" direction="column" gap={1}>
        <Text as="h2" styleAs="h3">
          4. Theming — pure CSS cascade
        </Text>
        <Text styleAs="body" className="tokens-page__section-lede">
          Light and dark values live under the same variable name, resolved in three layers — no JS branching
          required in consuming code.
        </Text>
        <Flexbox direction="column" gap="sm">
          <CodeBlock
            language="css"
            code={`:root {\n  --akds-color-surface-default: #FFFFFF; /* light default */\n}\n\n[data-theme='dark'] {\n  --akds-color-surface-default: #171717; /* explicit override */\n}\n\n@media (prefers-color-scheme: dark) {\n  :root:not([data-theme='light']) {\n    --akds-color-surface-default: #171717; /* OS-driven */\n  }\n}`}
          />
        </Flexbox>
      </Flexbox>

      <Divider />

      <Flexbox as="section" direction="column" gap={1}>
        <Text as="h2" styleAs="h3">
          5. Spacing, typography &amp; elevation
        </Text>
        <Text styleAs="body" className="tokens-page__section-lede">
          Non-color scales are flat and theme-invariant — the same value in light and dark mode.
        </Text>

        <Flexbox direction="column" gap="lg">
          <div>
            <Text styleAs="label">Layout spacing scale</Text>
            <Flexbox direction="column" gap="xs" mt={1}>
              {Object.entries(spacing.spacing.layout).map(([key, value]) => (
                <Flexbox key={key} align="center" gap="sm">
                  <Text styleAs="caption" className="tokens-page__bar-label">
                    {key}
                  </Text>
                  <div className="tokens-page__bar" style={{ width: `${value}px` }} />
                  <Text styleAs="caption" className="tokens-page__bar-value">
                    {value}px
                  </Text>
                </Flexbox>
              ))}
            </Flexbox>
          </div>

          <div>
            <Text styleAs="label">Type scale</Text>
            <Flexbox direction="column" gap="xs" mt={1}>
              {Object.entries(typography.fontSize).map(([key, value]) => (
                <Text key={key} styleAs="body" style={{ fontSize: value }}>
                  {key} — {value}px — The quick brown fox
                </Text>
              ))}
            </Flexbox>
          </div>

          <div>
            <Text styleAs="label">Elevation</Text>
            <Flexbox gap="md" wrap mt={1}>
              {ELEVATION_LEVELS.map((level) => (
                <div key={level} className="tokens-page__elevation-box" style={{ boxShadow: `var(--akds-elevation-${level})` }}>
                  {level}
                </div>
              ))}
            </Flexbox>
          </div>
        </Flexbox>
      </Flexbox>

      <Divider />

      <Flexbox as="section" direction="column" gap={1}>
        <Text as="h2" styleAs="h3">
          6. Distribution
        </Text>
        <Text styleAs="body" className="tokens-page__section-lede">
          Tokens ship both as raw CSS custom properties and typed JS/TS values from the same source of truth.
        </Text>
        <Flexbox direction="column" gap="sm">
          <CodeBlock language="css" code={"import '@aknishi/akds-tokens/css';"} />
          <CodeBlock
            language="tsx"
            code={"import { semanticColors, spacing, cssVars } from '@aknishi/akds-tokens';"}
          />
        </Flexbox>
      </Flexbox>

      <Text styleAs="caption" className="tokens-page__breakpoints-note">
        Breakpoints: {Object.entries(breakpoints).map(([key, value]) => `${key} ${value}px`).join(' · ')}
      </Text>
    </Flexbox>
  );
}
