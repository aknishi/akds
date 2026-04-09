import type { Meta } from '@storybook/react-vite';
import { Spinner } from './Spinner';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Spinner> = {
  title: 'Reactkit/Spinner',
  component: Spinner,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Spinner,
  code: `import { Spinner } from '@aknishi/akds-reactkit';

const SpinnerExample = () => <Spinner />;

export default SpinnerExample;
`,
});

export const Sizes = LiveEditStory({
  component: Spinner,
  code: `import { Flexbox, Spinner } from '@aknishi/akds-reactkit';

const SpinnerExample = () => (
  <Flexbox gap="md" align="center">
    <Spinner size="sm" />
    <Spinner size="md" />
    <Spinner size="lg" />
  </Flexbox>
);

export default SpinnerExample;
`,
});
