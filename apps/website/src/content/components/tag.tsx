import React from 'react';
import { Tag } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

function DismissibleTagExample() {
  const [visible, setVisible] = React.useState(true);
  if (!visible) return <Tag variant="default">Restored — refresh to see it again</Tag>;
  return (
    <Tag variant="info" onDismiss={() => setVisible(false)}>
      Dismissible
    </Tag>
  );
}

export const tag: ComponentEntry = {
  slug: 'tag',
  name: 'Tag',
  category: 'Data Display & Content',
  summary: 'A small status or label chip, with an optional dismiss button.',
  sourcePath: 'packages/reactkit/src/components/Tag',
  storybookId: 'reactkit-tag--docs',
  preview: <Tag variant="info">In progress</Tag>,
  examples: [
    {
      title: 'Variants',
      render: () => (
        <>
          <Tag variant="default">Default</Tag>
          <Tag variant="info">Info</Tag>
          <Tag variant="success">Success</Tag>
          <Tag variant="warning">Warning</Tag>
          <Tag variant="error">Error</Tag>
        </>
      ),
      code: `<Tag variant="default">Default</Tag>
<Tag variant="info">Info</Tag>
<Tag variant="success">Success</Tag>
<Tag variant="warning">Warning</Tag>
<Tag variant="error">Error</Tag>`,
    },
    {
      title: 'Dismissible',
      render: () => <DismissibleTagExample />,
      code: `<Tag variant="info" onDismiss={() => setVisible(false)}>
  Dismissible
</Tag>`,
    },
  ],
  accessibilityNotes: [
    'The dismiss button renders as a real <button> with an accessible name from dismissLabel (defaults to "Remove").',
    'Color is never the only signal — pair variant with clear label text describing the status.',
  ],
  props: [
    { name: 'variant', type: "'default' | 'info' | 'success' | 'warning' | 'error'", default: "'default'", description: 'The visual style of the tag.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'The size of the tag.' },
    { name: 'onDismiss', type: '() => void', description: 'When provided, renders a dismiss button.' },
    { name: 'dismissLabel', type: 'string', default: "'Remove'", description: 'Accessible label for the dismiss button.' },
    { name: 'children', type: 'React.ReactNode', description: 'Content rendered inside the tag. Required.' },
  ],
  doDont: [
    { do: 'Use variant to match the semantic meaning of the status (error for failures).', dont: "Don't use Tag as a clickable navigation element — it's a label, not a link." },
  ],
  related: ['avatar'],
};
