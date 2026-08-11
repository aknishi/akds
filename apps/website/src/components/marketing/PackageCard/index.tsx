import { Card, CardContent, CardHeader, Tag, Text } from '@aknishi/akds-reactkit';
import { CodeBlock } from '../../docs/CodeBlock';
import type { PackageEntry } from '../../../content/packages';
import './PackageCard.css';

export function PackageCard({ pkg }: { pkg: PackageEntry }) {
  return (
    <Card className="package-card">
      <CardHeader>
        <Text as="h3" styleAs="h5">
          {pkg.name}
        </Text>
        <Tag variant="default">{pkg.tagline}</Tag>
      </CardHeader>
      <CardContent>
        <Text styleAs="body" className="package-card__description">
          {pkg.description}
        </Text>
        <CodeBlock code={pkg.install} language="bash" />
      </CardContent>
    </Card>
  );
}
