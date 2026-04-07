import type { Meta } from '@storybook/react-vite';
import { Option } from './Option';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Option> = {
  title: 'Components/Option',
  component: Option,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

export default meta;

export const SingleSelect = LiveEditStory({
  component: Option,
  code: `import React from 'react';
import { DropdownMenu, Option } from '@aknishi/akds-reactkit';

const OptionExample = () => {
  const [value, setValue] = React.useState(undefined);
  return (
    <DropdownMenu label="Fruit" selected={value} onChange={v => setValue(v)}>
      <Option value="apple">Apple</Option>
      <Option value="banana">Banana</Option>
      <Option value="cherry">Cherry</Option>
    </DropdownMenu>
  );
};

export default OptionExample;
`,
});

export const MultiSelect = LiveEditStory({
  component: Option,
  code: `import React from 'react';
import { DropdownMenu, Option } from '@aknishi/akds-reactkit';

const OptionExample = () => {
  const [values, setValues] = React.useState([]);
  return (
    <DropdownMenu label="Toppings" multiple selected={values} onChange={v => setValues(v)}>
      <Option value="cheese">Cheese</Option>
      <Option value="tomato">Tomato</Option>
      <Option value="basil">Basil</Option>
      <Option value="anchovies" disabled>Anchovies</Option>
    </DropdownMenu>
  );
};

export default OptionExample;
`,
});
