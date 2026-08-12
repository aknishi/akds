import { NavLink, useParams } from 'react-router';
import { Card, CardContent, Flexbox, Tag, Text } from '@aknishi/akds-reactkit';
import { OpenInNewIcon, InfoIcon } from '@aknishi/akds-icons';
import { getComponentBySlug, componentRegistry } from '../../content/components/registry';
import { storybookDocsUrl } from '../../content/storybook';
import { ComponentPreviewFrame } from '../../components/docs/ComponentPreviewFrame';
import { CodeBlock } from '../../components/docs/CodeBlock';
import { PropsTable } from '../../components/docs/PropsTable';
import { DoDontPanel } from '../../components/docs/DoDontPanel';
import './ComponentDocPage.css';


const REPO_BASE = 'https://github.com/aknishi/akds/tree/main';

export function ComponentDocPage() {
  const { slug } = useParams();
  const entry = slug ? getComponentBySlug(slug) : undefined;

  if (!entry) {
    return (
      <Flexbox direction="column" gap="sm" py="2xl">
        <Text as="h1" styleAs="h2">
          Component not found
        </Text>
        <Text styleAs="body">
          <NavLink to="/components">Browse all components</NavLink>
        </Text>
      </Flexbox>
    );
  }

  const related = (entry.related ?? [])
    .map((relatedSlug) => componentRegistry.find((item) => item.slug === relatedSlug))
    .filter(Boolean);

  return (
    <Flexbox direction="column" gap="xl" className="component-doc-page">
      <Flexbox direction="column" gap="sm">
        <Flexbox align="center" gap="sm" wrap>
          <Text as="h1" styleAs="h1">
            {entry.name}
          </Text>
          <Tag variant="default">{entry.category}</Tag>
        </Flexbox>
        <Text styleAs="body" className="component-doc-page__summary">
          {entry.summary}
        </Text>
        <Flexbox gap="md" wrap>
          <a
            href={`${REPO_BASE}/${entry.sourcePath}`}
            target="_blank"
            rel="noreferrer"
            className="component-doc-page__source-link"
          >
            View source <OpenInNewIcon size="sm" />
          </a>
          <a
            href={storybookDocsUrl(entry.storybookId)}
            target="_blank"
            rel="noreferrer"
            className="component-doc-page__source-link"
          >
            Open in Storybook <OpenInNewIcon size="sm" />
          </a>
        </Flexbox>
      </Flexbox>

      {entry.isPrimitive && (
        <div className="component-doc-page__primitive-banner">
          <InfoIcon color="info" />
          <Text styleAs="body">
            {entry.name} is an internal primitive used by other components — it isn't typically used directly in
            application code.
          </Text>
        </div>
      )}

      <section>
        <Text as="h2" styleAs="h3" className="component-doc-page__section-title">
          Examples
        </Text>
        <Flexbox direction="column" gap="lg">
          {entry.examples.map((example) => (
            <Flexbox direction="column" gap="sm" key={example.title}>
              <Flexbox direction="column" gap="xs">
                <Text as="h3" styleAs="h5">
                  {example.title}
                </Text>
                {example.description && <Text styleAs="body">{example.description}</Text>}
              </Flexbox>
              <ComponentPreviewFrame>{example.render()}</ComponentPreviewFrame>
              <CodeBlock code={example.code} />
            </Flexbox>
          ))}
        </Flexbox>
      </section>

      <section>
        <Text as="h2" styleAs="h3" className="component-doc-page__section-title">
          Accessibility
        </Text>
        <Card>
          <CardContent>
            <ul className="component-doc-page__a11y-list">
              {entry.accessibilityNotes.map((note) => (
                <li key={note}>
                  <Text styleAs="body">{note}</Text>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <Text as="h2" styleAs="h3" className="component-doc-page__section-title">
          Props
        </Text>
        <PropsTable props={entry.props} />
      </section>

      {!entry.isPrimitive && entry.doDont && entry.doDont.length > 0 && (
        <section>
          <Text as="h2" styleAs="h3" className="component-doc-page__section-title">
            Do's and don'ts
          </Text>
          <Flexbox direction="column" gap="sm">
            {entry.doDont.map((pair) => (
              <DoDontPanel key={pair.do} pair={pair} />
            ))}
          </Flexbox>
        </section>
      )}

      {!entry.isPrimitive && related.length > 0 && (
        <section>
          <Text as="h2" styleAs="h3" className="component-doc-page__section-title">
            Related components
          </Text>
          <Flexbox gap="sm" wrap>
            {related.map((item) => (
              <NavLink key={item!.slug} to={`/components/${item!.slug}`} className="component-doc-page__related-link">
                {item!.name}
              </NavLink>
            ))}
          </Flexbox>
        </section>
      )}
    </Flexbox>
  );
}
