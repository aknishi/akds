import { NavLink } from 'react-router';
import { Divider, Flexbox, Text } from '@aknishi/akds-reactkit';
import { PageContainer } from '../PageContainer';
import './Footer.css';

const FOOTER_LINKS = [
  { label: 'Getting Started', to: '/getting-started' },
  { label: 'Components', to: '/components' },
  { label: 'Tokens', to: '/tokens' },
  { label: 'Design Guidelines', to: '/guidelines/design' },
  { label: 'Accessibility', to: '/guidelines/accessibility' },
  { label: 'Packages', to: '/packages' },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <PageContainer>
        <Divider />
        <Flexbox justify="space-between" align="center" wrap py="lg" gap="md">
          <Text styleAs="caption">© {new Date().getFullYear()} AKDS. A themeable React design system.</Text>
          <Flexbox as="nav" aria-label="Footer navigation" gap="md" wrap>
            {FOOTER_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className="site-footer__link">
                {link.label}
              </NavLink>
            ))}
          </Flexbox>
        </Flexbox>
      </PageContainer>
    </footer>
  );
}
