import type { Meta } from '@storybook/react';
import { Spinner } from './Spinner';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Spinner,
  code: `import { Spinner } from '@akds/reactkit';

const SpinnerExample = () => <Spinner />;

export default SpinnerExample;
`,
});

export const Sizes = LiveEditStory({
  component: Spinner,
  code: `import { Spinner } from '@akds/reactkit';

const SpinnerExample = () => (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
    <Spinner size="sm" />
    <Spinner size="md" />
    <Spinner size="lg" />
  </div>
);

export default SpinnerExample;
`,
});
