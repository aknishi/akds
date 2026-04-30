import type { Meta } from '@storybook/react-vite';
import { Tag } from './Tag';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Tag> = {
  title: 'Reactkit/Tag',
  component: Tag,
  argTypes: {
    variant: { control: 'select', options: ['default', 'info', 'success', 'warning', 'error'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Tag,
  code: `import { Tag } from '@aknishi/akds-reactkit';

const Example = () => <Tag>Design system</Tag>;

export default Example;
`,
});

export const Variants = LiveEditStory({
  component: Tag,
  code: `import { Flexbox, Tag } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox gap="sm">
    <Tag variant="default">Default</Tag>
    <Tag variant="info">Info</Tag>
    <Tag variant="success">Success</Tag>
    <Tag variant="warning">Warning</Tag>
    <Tag variant="error">Error</Tag>
  </Flexbox>
);

export default Example;
`,
});

export const Sizes = LiveEditStory({
  component: Tag,
  code: `import { Flexbox, Tag } from '@aknishi/akds-reactkit';

const Example = () => (
  <Flexbox gap="sm" align="center">
    <Tag size="sm">Small</Tag>
    <Tag size="md">Medium</Tag>
    <Tag size="lg">Large</Tag>
  </Flexbox>
);

export default Example;
`,
});

export const Dismissible = LiveEditStory({
  component: Tag,
  code: `import React from 'react';
import { Flexbox, Tag } from '@aknishi/akds-reactkit';

const Example = () => {
  const [tags, setTags] = React.useState(['React', 'TypeScript', 'Design system']);
  return (
    <Flexbox gap="sm">
      {tags.map(tag => (
        <Tag
          key={tag}
          onDismiss={() => setTags(prev => prev.filter(t => t !== tag))}
          dismissLabel={\`Remove \${tag}\`}
        >
          {tag}
        </Tag>
      ))}
    </Flexbox>
  );
};

export default Example;
`,
});
