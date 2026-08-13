import { Card, CardContent, CardHeader, Tag, Text, Flexbox} from '@aknishi/akds-reactkit';
import { CodeBlock } from '../../docs/CodeBlock';
import type { PackageEntry } from '../../../content/packages';
import './PackageCard.css';

export function PackageCard({ pkg }: { pkg: PackageEntry }) {
  return (
    <Card className="package-card">
      <CardHeader>
        <Flexbox direction="column" gap="xs" align="start">
          <Text as="h3" styleAs="h5">
            {pkg.name}
          </Text>
          <Tag variant="default">{pkg.tagline}</Tag>
        </Flexbox>
      </CardHeader>
      <CardContent>
        <Flexbox direction="column" justify='space-between' gap="sm"style={{ height: '100%' }}>
          <Text styleAs="body" className="package-card__description">
            {pkg.description}
          </Text>
          <CodeBlock code={pkg.install} language="bash" />
        </Flexbox>
      </CardContent>
    </Card>
  );
}
