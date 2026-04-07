import type { Meta } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Checkbox,
  code: `import { Checkbox } from '@akds/reactkit';

const CheckboxExample = () => <Checkbox label="Accept terms and conditions" />;

export default CheckboxExample;
`,
});

export const States = LiveEditStory({
  component: Checkbox,
  code: `import { Checkbox } from '@akds/reactkit';

const CheckboxExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <Checkbox label="Unchecked" />
    <Checkbox label="Checked" defaultChecked />
    <Checkbox label="Indeterminate" indeterminate />
    <Checkbox label="Disabled" disabled />
    <Checkbox label="Disabled checked" disabled defaultChecked />
  </div>
);

export default CheckboxExample;
`,
});

export const Sizes = LiveEditStory({
  component: Checkbox,
  code: `import { Checkbox } from '@akds/reactkit';

const CheckboxExample = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <Checkbox label="Small" size="sm" />
    <Checkbox label="Medium" size="md" />
    <Checkbox label="Large" size="lg" />
  </div>
);

export default CheckboxExample;
`,
});
