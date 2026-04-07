import type { Meta } from '@storybook/react';
import { RadioGroup } from './RadioGroup';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;

export const Vertical = LiveEditStory({
  component: RadioGroup,
  code: `import { RadioGroup, Radio } from '@aknishi/akds-reactkit';

const RadioGroupExample = () => (
  <RadioGroup name="fruit" legend="Pick a fruit">
    <Radio value="apple" label="Apple" />
    <Radio value="banana" label="Banana" />
    <Radio value="cherry" label="Cherry" />
  </RadioGroup>
);

export default RadioGroupExample;
`,
});

export const Horizontal = LiveEditStory({
  component: RadioGroup,
  code: `import { RadioGroup, Radio } from '@aknishi/akds-reactkit';

const RadioGroupExample = () => (
  <RadioGroup name="size" legend="Size" orientation="horizontal">
    <Radio value="sm" label="Small" />
    <Radio value="md" label="Medium" />
    <Radio value="lg" label="Large" />
  </RadioGroup>
);

export default RadioGroupExample;
`,
});

export const Disabled = LiveEditStory({
  component: RadioGroup,
  code: `import { RadioGroup, Radio } from '@aknishi/akds-reactkit';

const RadioGroupExample = () => (
  <RadioGroup name="disabled-group" disabled>
    <Radio value="a" label="Option A" />
    <Radio value="b" label="Option B" />
  </RadioGroup>
);

export default RadioGroupExample;
`,
});
