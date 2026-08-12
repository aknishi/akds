import { NavLink } from 'react-router';
import { Button, Flexbox, Text } from '@aknishi/akds-reactkit';
import { ArrowForwardIcon } from '@aknishi/akds-icons';
import './TokenTeaser.css';

const PRIMITIVE_SWATCHES = [
  { label: 'blue-300', var: '--akds-primitive-color-blue-300' },
  { label: 'blue-500', var: '--akds-primitive-color-blue-500' },
  { label: 'blue-700', var: '--akds-primitive-color-blue-700' },
  { label: 'blue-900', var: '--akds-primitive-color-blue-900' },
];

const SEMANTIC_SWATCHES = [
  { label: 'color-background-primary-default', var: '--akds-color-background-primary-default' },
  { label: 'color-background-info-default', var: '--akds-color-background-info-default' },
];

export function TokenTeaser() {
  return (
    <Flexbox direction="column" gap="lg" className="token-teaser">
      <Flexbox direction="column" gap="sm">
        <Text as="h2" styleAs="h2">
          Two layers, one source of truth
        </Text>
        <Text styleAs="body" className="token-teaser__subhead">
          Raw primitive colors feed role-based semantic tokens. Components consume semantic tokens only — so
          switching themes never means touching component code.
        </Text>
      </Flexbox>

      <Flexbox align="flex-start" gap="lg" padding={3} className="token-teaser__diagram">
        <Flexbox direction="column" align="center" gap="md">
          <Text styleAs="caption" className="token-teaser__row-label">
            Primitive
          </Text>
          <Flexbox gap="md">
            {PRIMITIVE_SWATCHES.map((swatch) => (
              <Flexbox key={swatch.var} direction="column" align="center" gap="xs" className="token-teaser__swatch-group">
                <div className="token-teaser__swatch" style={{ background: `var(${swatch.var})` }} />
                <Text styleAs="caption" className="token-teaser__swatch-label">
                  {swatch.label}
                </Text>
              </Flexbox>
            ))}
          </Flexbox>
        </Flexbox>

        <ArrowForwardIcon size="lg" color="default" className="token-teaser__arrow" />

        <Flexbox direction="column" align="center" gap="md">
          <Text styleAs="caption" className="token-teaser__row-label">
            Semantic
          </Text>
          <Flexbox gap="md">
            {SEMANTIC_SWATCHES.map((swatch) => (
              <Flexbox key={swatch.var} direction="column" align="center" gap="xs" className="token-teaser__swatch-group">
                <div className="token-teaser__swatch" style={{ background: `var(${swatch.var})` }} />
                <Text styleAs="caption" className="token-teaser__swatch-label">
                  {swatch.label}
                </Text>
              </Flexbox>
            ))}
          </Flexbox>
        </Flexbox>
      </Flexbox>

      <NavLink to="/tokens" className="token-teaser__cta">
        <Button appearance="bordered" emphasis="neutral">
          Explore token architecture
        </Button>
      </NavLink>
    </Flexbox>
  );
}
