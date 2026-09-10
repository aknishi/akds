import type { Meta } from '@storybook/react-vite';
import { GenerationLoader } from './GenerationLoader';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof GenerationLoader> = {
  title: 'Reactkit/AI/GenerationLoader',
  component: GenerationLoader,
  argTypes: {
    label: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: GenerationLoader,
  code: `import { GenerationLoader } from '@aknishi/akds-reactkit';

const Example = () => <GenerationLoader />;

export default Example;
`,
});

export const WithLabel = LiveEditStory({
  component: GenerationLoader,
  code: `import { GenerationLoader } from '@aknishi/akds-reactkit';

const Example = () => <GenerationLoader label="Generating response" />;

export default Example;
`,
});

export const Sizes = LiveEditStory({
  component: GenerationLoader,
  code: `import { GenerationLoader } from '@aknishi/akds-reactkit';

const Example = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
    <GenerationLoader size="sm" label="Small" />
    <GenerationLoader size="md" label="Medium" />
    <GenerationLoader size="lg" label="Large" />
  </div>
);

export default Example;
`,
});
