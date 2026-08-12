import { Button, Card, CardContent, CardFooter, CardHeader, Text } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const card: ComponentEntry = {
  slug: 'card',
  name: 'Card',
  category: 'Layout',
  summary: 'A bordered surface container, composed with CardHeader, CardContent, and CardFooter slots.',
  sourcePath: 'packages/reactkit/src/components/Card',
  storybookId: 'reactkit-card--docs',
  examples: [
    {
      title: 'Composed',
      render: () => (
        <Card>
          <CardHeader>
            <Text as="h3" styleAs="h5">
              Plan usage
            </Text>
          </CardHeader>
          <CardContent>
            <Text styleAs="body">You've used 8 of 10 seats this month.</Text>
          </CardContent>
          <CardFooter>
            <Button appearance="bordered" emphasis="neutral" size="sm">
              Manage
            </Button>
          </CardFooter>
        </Card>
      ),
      code: `<Card>
  <CardHeader>
    <Text as="h3" styleAs="h5">Plan usage</Text>
  </CardHeader>
  <CardContent>
    <Text styleAs="body">You've used 8 of 10 seats this month.</Text>
  </CardContent>
  <CardFooter>
    <Button appearance="bordered" emphasis="neutral" size="sm">Manage</Button>
  </CardFooter>
</Card>`,
    },
    {
      title: 'Borderless',
      render: () => (
        <Card borderless>
          <CardContent>
            <Text styleAs="body">A borderless card, useful when the surrounding layout already provides separation.</Text>
          </CardContent>
        </Card>
      ),
      code: `<Card borderless>
  <CardContent>
    <Text styleAs="body">...</Text>
  </CardContent>
</Card>`,
    },
  ],
  accessibilityNotes: [
    'Card and its slots render plain <div>s — there is no implicit landmark or heading role, so use a real heading element (e.g. Text as="h3") inside CardHeader for document structure.',
    'borderless only affects visual styling; it does not change semantics.',
  ],
  props: [
    { name: 'borderless', type: 'boolean', default: 'false', description: 'Removes the border and hides dividers in CardHeader/CardFooter.' },
    { name: 'children', type: 'React.ReactNode', description: 'Typically CardHeader, CardContent, and/or CardFooter. Required.' },
  ],
  doDont: [
    { do: 'Compose Card from CardHeader/CardContent/CardFooter for consistent spacing.', dont: "Don't put raw content directly in Card without CardContent — spacing won't match other cards." },
  ],
  related: ['divider', 'flexbox'],
};
