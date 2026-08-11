import { Card, CardContent, Flexbox, Text } from '@aknishi/akds-reactkit';
import { CodeBlock } from '../../components/docs/CodeBlock';
import { packages } from '../../content/packages';
import './GettingStartedPage.css';

const reactkit = packages[0];

export function GettingStartedPage() {
  return (
    <Flexbox direction="column" gap="xl" className="getting-started-page">
      <Flexbox direction="column" gap="sm">
        <Text as="h1" styleAs="h1">
          Getting started
        </Text>
        <Text styleAs="body">
          AKDS is a themeable React design system: components, design tokens, and an icon set, built as a monorepo.
          The fastest way to try it is the scaffolding CLI — or add the packages to an existing app.
        </Text>
      </Flexbox>

      <Flexbox direction="column" gap="md">
        <Text as="h2" styleAs="h3">
          Scaffold a new app
        </Text>
        <Card>
          <CardContent>
            <CodeBlock code={`npx @aknishi/create-akds-app my-app\ncd my-app\nnpm run dev`} language="bash" />
          </CardContent>
        </Card>
      </Flexbox>

      <Flexbox direction="column" gap="md">
        <Text as="h2" styleAs="h3">
          Or install into an existing app
        </Text>
        <Card>
          <CardContent>
            <Flexbox direction="column" gap="sm">
              <CodeBlock code="npm install @aknishi/akds-reactkit @aknishi/akds-tokens @aknishi/akds-icons" language="bash" />
              <CodeBlock code={reactkit.usage ?? ''} language="tsx" />
            </Flexbox>
          </CardContent>
        </Card>
      </Flexbox>

      <Flexbox direction="column" gap="md">
        <Text as="h2" styleAs="h3">
          Next steps
        </Text>
        <Text styleAs="body">
          Browse the full component library, learn how the token system is structured, and read the design and
          accessibility guidelines that every akds component follows.
        </Text>
      </Flexbox>
    </Flexbox>
  );
}
