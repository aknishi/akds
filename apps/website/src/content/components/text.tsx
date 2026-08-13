import { Text } from '@aknishi/akds-reactkit';
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
      title: 'Scale',
      render: () => (
        <>
          <Text as="h2" styleAs="h2">
            Heading 2
          </Text>
          <Text styleAs="body">Body text — the default paragraph style.</Text>
          <Text styleAs="caption">Caption text — smaller, muted.</Text>
        </>
      ),
      code: `<Text as="h2" styleAs="h2">Heading 2</Text>
<Text styleAs="body">Body text — the default paragraph style.</Text>
<Text styleAs="caption">Caption text — smaller, muted.</Text>`,
    },
    {
      title: 'Style vs. element override',
      description: 'as lets a heading-styled element render as a <div>, or vice versa, without changing the visual style.',
      render: () => (
        <Text as="div" styleAs="h4">
          Styled like an h4, rendered as a div
        </Text>
      ),
      code: `<Text as="div" styleAs="h4">
  Styled like an h4, rendered as a div
</Text>`,
    },
    {
      title: 'Color',
      description: 'color applies a semantic text color independent of styleAs.',
      render: () => (
        <>
          <Text color="primary">Primary text</Text>
          <Text color="success">Success text</Text>
          <Text color="error">Error text</Text>
          <Text color="neutral">Neutral text</Text>
        </>
      ),
      code: `<Text color="primary">Primary text</Text>
<Text color="success">Success text</Text>
<Text color="error">Error text</Text>
<Text color="neutral">Neutral text</Text>`,
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
