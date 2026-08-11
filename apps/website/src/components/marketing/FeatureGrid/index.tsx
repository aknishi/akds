import { Card, CardContent, Text } from '@aknishi/akds-reactkit';
import { PaletteIcon, VerifiedUserIcon, GridViewIcon, AppsIcon } from '@aknishi/akds-icons';
import './FeatureGrid.css';

const FEATURES = [
  {
    icon: PaletteIcon,
    title: 'Themeable',
    description: 'Light and dark themes ship out of the box, driven entirely by CSS custom properties.',
  },
  {
    icon: VerifiedUserIcon,
    title: 'Accessible',
    description: 'Every component ships with semantic HTML, keyboard support, and an axe test suite.',
  },
  {
    icon: GridViewIcon,
    title: 'Token-driven',
    description: 'Primitive and semantic tokens keep color, spacing, and type consistent everywhere.',
  },
  {
    icon: AppsIcon,
    title: 'Composable',
    description: 'Compound components like Tabs and Menu share state through context, not prop drilling.',
  },
];

export function FeatureGrid() {
  return (
    <div className="feature-grid">
      {FEATURES.map(({ icon: Icon, title, description }) => (
        <Card key={title} className="feature-grid__card">
          <CardContent>
            <div className="feature-grid__icon">
              <Icon size="lg" color="info" />
            </div>
            <Text as="h3" styleAs="h4">
              {title}
            </Text>
            <Text styleAs="body" className="feature-grid__description">
              {description}
            </Text>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
