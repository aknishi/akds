import { NavLink } from 'react-router';
import { Button, Text, Flexbox } from '@aknishi/akds-reactkit';
import './NotFoundPage.css';

export function NotFoundPage() {
  return (
    <Flexbox direction="column" align="center" gap="md" py="2xl" className="not-found-page">
      <Text as="h1" styleAs="h1">
        Page not found
      </Text>
      <Text styleAs="body">The page you're looking for doesn't exist.</Text>
      <NavLink to="/" className="not-found-page__cta">
        <Button appearance="solid" emphasis="accented">
          Back home
        </Button>
      </NavLink>
    </Flexbox>
  );
}
