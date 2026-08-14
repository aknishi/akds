import { Flexbox, Text } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const text: ComponentEntry = {
  slug: 'text',
  name: 'Text',
  category: 'Data Display & Content',
  summary: 'The typography primitive — maps a visual style to a semantic HTML element, with an override escape hatch.',
  sourcePath: 'packages/reactkit/src/components/Text',
  storybookId: 'reactkit-text--docs',
  examples: [
    {
      title: 'Headings',
      render: () => (
        <Flexbox direction="column" gap="sm">
          <Text styleAs="hero">Hero heading</Text>
          <Text styleAs="h1">Heading 1</Text>
          <Text styleAs="h2">Heading 2</Text>
          <Text styleAs="h3">Heading 3</Text>
          <Text styleAs="h4">Heading 4</Text>
          <Text styleAs="h5">Heading 5</Text>
          <Text styleAs="h6">Heading 6</Text>
        </Flexbox>
      ),
      code: `<Flexbox direction="column" gap="sm">
  <Text styleAs="hero">Hero heading</Text>
  <Text styleAs="h1">Heading 1</Text>
  <Text styleAs="h2">Heading 2</Text>
  <Text styleAs="h3">Heading 3</Text>
  <Text styleAs="h4">Heading 4</Text>
  <Text styleAs="h5">Heading 5</Text>
  <Text styleAs="h6">Heading 6</Text>
</Flexbox>`,
    },
    {
      title: 'Body styles',
      render: () => (
        <Flexbox direction="column" gap="sm">
          <Text styleAs="body">Body — the default text style for paragraphs.</Text>
          <Text styleAs="label">Label — used for form labels and UI labels.</Text>
          <Text styleAs="caption">Caption — supplementary text at a smaller size.</Text>
        </Flexbox>
      ),
      code: `<Flexbox direction="column" gap="sm">
  <Text styleAs="body">Body — the default text style for paragraphs.</Text>
  <Text styleAs="label">Label — used for form labels and UI labels.</Text>
  <Text styleAs="caption">Caption — supplementary text at a smaller size.</Text>
</Flexbox>`,
    },
    {
      title: 'Colors',
      description: 'color applies a semantic text color independent of styleAs.',
      render: () => (
        <Flexbox direction="column" gap="sm">
          <Text color="neutral">Neutral — the default text color.</Text>
          <Text color="primary">Primary — used to draw attention to key text.</Text>
          <Text color="success">Success — indicates a positive state.</Text>
          <Text color="error">Error — indicates a problem or failure.</Text>
        </Flexbox>
      ),
      code: `<Flexbox direction="column" gap="sm">
  <Text color="neutral">Neutral — the default text color.</Text>
  <Text color="primary">Primary — used to draw attention to key text.</Text>
  <Text color="success">Success — indicates a positive state.</Text>
  <Text color="error">Error — indicates a problem or failure.</Text>
</Flexbox>`,
    },
    {
      title: 'Style vs. element override',
      description: 'as lets a visual style render on a different element than its default, without changing the visual style.',
      render: () => (
        <Flexbox direction="column" gap="sm">
          <Text styleAs="h3" as="span">
            h3 style rendered as a span
          </Text>
          <Text styleAs="caption" as="p">
            Caption style rendered as a paragraph
          </Text>
          <Text styleAs="label" as="label">
            Label style rendered as a label element
          </Text>
        </Flexbox>
      ),
      code: `<Flexbox direction="column" gap="sm">
  <Text styleAs="h3" as="span">h3 style rendered as a span</Text>
  <Text styleAs="caption" as="p">Caption style rendered as a paragraph</Text>
  <Text styleAs="label" as="label">Label style rendered as a label element</Text>
</Flexbox>`,
    },
  ],
  accessibilityNotes: [
    'By default, styleAs maps to its matching semantic element (h1-h6 render <h1>-<h6>, body renders <p>) — keeping the document outline correct without extra props.',
    'Use as to decouple visual style from semantics only when necessary (e.g. a visually large label that isn\'t a real heading) — don\'t skip heading levels for style reasons.',
  ],
  props: [
    { name: 'styleAs', type: "'hero' | 'h1'-'h6' | 'body' | 'label' | 'caption'", default: "'body'", description: 'Controls the visual typography style applied.' },
    { name: 'as', type: 'React.ElementType', description: 'The HTML element to render as. Defaults to the semantic element for styleAs.' },
    { name: 'color', type: "'primary' | 'success' | 'error' | 'neutral'", description: 'Applies a semantic text color. When omitted, color follows the default for the chosen styleAs.' },
    { name: 'children', type: 'React.ReactNode', description: 'The text content to display. Required.' },
  ],
  doDont: [
    { do: 'Choose styleAs by visual hierarchy, and as only when semantics need to diverge.', dont: "Don't skip heading levels (h1 straight to h4) purely to get a smaller style — use as instead." },
  ],
  related: [],
};
