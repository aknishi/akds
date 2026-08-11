import { NavLink } from 'react-router';
import { elevation } from '@aknishi/akds-tokens';
import { Card, CardContent, Divider, Flexbox, Text } from '@aknishi/akds-reactkit';
import {
  AppsIcon,
  CalendarMonthIcon,
  DeleteIcon,
  HomeIcon,
  SearchIcon,
  SettingsIcon,
} from '@aknishi/akds-icons';
import { TokenSwatch } from '../../components/docs/TokenSwatch';
import { DoDontPanel } from '../../components/docs/DoDontPanel';
import './GuidelinesDesignPage.css';


const PRINCIPLES = [
  { title: 'Tokens over hardcoding', description: 'Every color, space, radius, and font value comes from a design token — never a raw hex code or pixel value.' },
  { title: 'Semantic before primitive', description: 'Components consume role-based semantic tokens, not primitive scales — that indirection is what makes theming free.' },
  { title: 'Composition over configuration', description: 'Compound components (Tabs, Menu, Accordion) compose from small pieces sharing context, instead of one component with dozens of flags.' },
  { title: 'Accessible by default', description: 'Semantic HTML, visible focus states, and keyboard support are the baseline, not an opt-in.' },
];

const COLOR_ROLES = [
  { role: 'background-primary-default', description: 'Primary actions and emphasis' },
  { role: 'background-success-default', description: 'Success states' },
  { role: 'background-error-default', description: 'Errors and destructive actions' },
  { role: 'background-warning-default', description: 'Warnings' },
  { role: 'background-info-default', description: 'Informational accents' },
  { role: 'surface-raised', description: 'Cards and elevated surfaces' },
];

const ICON_SAMPLES = [SearchIcon, HomeIcon, SettingsIcon, CalendarMonthIcon, DeleteIcon, AppsIcon];

const ELEVATION_LEVELS = Object.keys(elevation).filter((key) => key !== 'none') as Array<
  Exclude<keyof typeof elevation, 'none'>
>;

export function GuidelinesDesignPage() {
  return (
    <Flexbox direction="column" gap="xl" className="design-guidelines-page">
      <Flexbox direction="column" gap="sm">
        <Text as="h1" styleAs="h1">
          Design guidelines
        </Text>
        <Text styleAs="body" className="design-guidelines-page__lede">
          How color, typography, spacing, elevation, and iconography come together across every akds surface.
        </Text>
      </Flexbox>

      <section>
        <Text as="h2" styleAs="h3">
          Principles
        </Text>
        <div className="design-guidelines-page__principles-grid">
          {PRINCIPLES.map((principle) => (
            <Card key={principle.title}>
              <CardContent>
                <Text as="h3" styleAs="label">
                  {principle.title}
                </Text>
                <Text styleAs="body" className="design-guidelines-page__principle-description">
                  {principle.description}
                </Text>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Divider />

      <section>
        <Text as="h2" styleAs="h3">
          Color usage
        </Text>
        <Text styleAs="body" className="design-guidelines-page__section-lede">
          Pick color by role, not by hue. Full token reference on the{' '}
          <NavLink to="/tokens">token architecture</NavLink> page.
        </Text>
        <div className="design-guidelines-page__color-grid">
          {COLOR_ROLES.map((item) => (
            <TokenSwatch key={item.role} varName={`--akds-color-${item.role}`} label={item.description} />
          ))}
        </div>
      </section>

      <Divider />

      <section>
        <Text as="h2" styleAs="h3">
          Typography
        </Text>
        <Flexbox direction="column" gap="sm">
          <Text as="h1" styleAs="h1">
            Heading 1
          </Text>
          <Text as="h2" styleAs="h2">
            Heading 2
          </Text>
          <Text as="h3" styleAs="h3">
            Heading 3
          </Text>
          <Text styleAs="body">Body — the default paragraph style, used for most reading content.</Text>
          <Text styleAs="label">Label — used for form labels and compact UI text.</Text>
          <Text styleAs="caption">Caption — smaller, muted, for metadata and helper text.</Text>
        </Flexbox>
      </section>

      <Divider />

      <section>
        <Text as="h2" styleAs="h3">
          Spacing &amp; layout
        </Text>
        <Text styleAs="body" className="design-guidelines-page__section-lede">
          Use Flexbox's token-aware gap/padding/margin props instead of arbitrary pixel values.
        </Text>
        <Flexbox gap="sm" wrap>
          {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
            <div key={size} className="design-guidelines-page__spacing-item">
              <div className={`design-guidelines-page__spacing-box design-guidelines-page__spacing-box--${size}`} />
              <Text styleAs="caption">{size}</Text>
            </div>
          ))}
        </Flexbox>
      </section>

      <Divider />

      <section>
        <Text as="h2" styleAs="h3">
          Elevation
        </Text>
        <Flexbox gap="md" wrap>
          {ELEVATION_LEVELS.map((level) => (
            <div
              key={level}
              className="design-guidelines-page__elevation-box"
              style={{ boxShadow: `var(--akds-elevation-${level})` }}
            >
              {level}
            </div>
          ))}
        </Flexbox>
      </section>

      <Divider />

      <section>
        <Text as="h2" styleAs="h3">
          Iconography
        </Text>
        <Text styleAs="body" className="design-guidelines-page__section-lede">
          Icons from <code>@aknishi/akds-icons</code> are sized with the same spacing scale as everything else.
        </Text>
        <Flexbox gap="lg" wrap>
          {ICON_SAMPLES.map((Icon, index) => (
            <Icon key={index} size="lg" color="default" />
          ))}
        </Flexbox>
      </section>

      <Divider />

      <section>
        <Text as="h2" styleAs="h3">
          Do's and don'ts
        </Text>
        <Flexbox direction="column" gap="sm">
          <DoDontPanel pair={{ do: 'Reference tokens via var(--akds-*) or the JS token exports.', dont: "Don't hardcode hex values like #3B82F6 in component or page CSS." }} />
          <DoDontPanel pair={{ do: 'Build layouts from Flexbox spacing props.', dont: "Don't hand-tune pixel margins that drift from the spacing scale." }} />
        </Flexbox>
      </section>

      <Divider />

      <section>
        <Text as="h2" styleAs="h3">
          Theming
        </Text>
        <Text styleAs="body" className="design-guidelines-page__section-lede">
          Light and dark values live under the same CSS variable name — see the full cascade explanation on the{' '}
          <NavLink to="/tokens">token architecture</NavLink> page.
        </Text>
      </section>
    </Flexbox>
  );
}
