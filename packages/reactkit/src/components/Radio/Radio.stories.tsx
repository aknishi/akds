import type { Meta } from '@storybook/react';
import { Radio } from './Radio';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Radio,
  code: `import { Radio } from '@akds/reactkit';

const RadioExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <Radio label="Option A" value="a" name="radio-default" />
    <Radio label="Option B" value="b" name="radio-default" />
    <Radio label="Option C" value="c" name="radio-default" />
  </div>
);

export default RadioExample;
`,
});

export const States = LiveEditStory({
  component: Radio,
  code: `import { Radio } from '@akds/reactkit';

const RadioExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <Radio label="Unchecked" value="a" name="radio-states" />
    <Radio label="Checked" value="b" name="radio-states" defaultChecked />
    <Radio label="Disabled" value="c" name="radio-states-disabled" disabled />
  </div>
);

export default RadioExample;
`,
});

export const Sizes = LiveEditStory({
  component: Radio,
  code: `import { Radio } from '@akds/reactkit';

const RadioExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <Radio label="Small" value="sm" name="radio-sizes" size="sm" />
    <Radio label="Medium" value="md" name="radio-sizes" size="md" />
    <Radio label="Large" value="lg" name="radio-sizes" size="lg" />
  </div>
);

export default RadioExample;
`,
});
