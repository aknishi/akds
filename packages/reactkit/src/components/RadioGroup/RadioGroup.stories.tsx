import type { Meta } from '@storybook/react-vite';
import { RadioGroup } from './RadioGroup';
import { Radio } from '../Radio';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof RadioGroup> = {
  title: 'Reactkit/Radio',
  component: RadioGroup,
  subcomponents: { Radio },
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
  <RadioGroup name="delivery" legend="Delivery speed" orientation="horizontal">
    <Radio value="standard" label="Standard" />
    <Radio value="express" label="Express" />
    <Radio value="overnight" label="Overnight" />
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
