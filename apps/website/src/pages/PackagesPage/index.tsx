import { Card, CardContent, CardHeader, Flexbox, Tag, Text } from '@aknishi/akds-reactkit';
import { CodeBlock } from '../../components/docs/CodeBlock';
import { packages } from '../../content/packages';
import './PackagesPage.css';


export function PackagesPage() {
  return (
    <Flexbox direction="column" gap="xl" className="packages-page">
      <Flexbox direction="column" gap="sm">
        <Text as="h1" styleAs="h1">
          Packages
        </Text>
        <Text styleAs="body" className="packages-page__lede">
          AKDS is published as four independent, versioned packages under the <code>@aknishi</code> npm scope. Use
          only what you need.
        </Text>
      </Flexbox>

      <Flexbox direction="column" gap="lg">
        {packages.map((pkg) => (
          <Card key={pkg.name}>
            <CardHeader>
              <Flexbox align="center" gap="sm" wrap>
                <Text as="h2" styleAs="h4">
                  {pkg.name}
                </Text>
                <Tag variant="default">{pkg.tagline}</Tag>
              </Flexbox>
            </CardHeader>
            <CardContent>
              <Text styleAs="body" className="packages-page__description">
                {pkg.description}
              </Text>
              <Flexbox direction="column" gap="sm">
                <div>
                  <Text styleAs="caption" className="packages-page__label">
                    Install
                  </Text>
                  <CodeBlock code={pkg.install} language="bash" />
                </div>
                {pkg.usage && (
                  <div>
                    <Text styleAs="caption" className="packages-page__label">
                      Usage
                    </Text>
                    <CodeBlock code={pkg.usage} language={pkg.name.includes('create-akds-app') ? 'bash' : 'tsx'} />
                  </div>
                )}
              </Flexbox>
            </CardContent>
          </Card>
        ))}
      </Flexbox>
    </Flexbox>
  );
}
