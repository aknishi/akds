import type { Meta } from '@storybook/react-vite';
import { DropdownMenu } from './DropdownMenu';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  argTypes: {
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
    placeholder: { control: 'text' },
  },
};

export default meta;

export const SingleSelect = LiveEditStory({
  component: DropdownMenu,
  code: `import React from 'react';
import { DropdownMenu, Option } from '@aknishi/akds-reactkit';

const DropdownMenuExample = () => {
  const [value, setValue] = React.useState(undefined);
  return (
    <div style={{ minHeight: '200px'}}>
      <DropdownMenu label="Fruit" selected={value} onChange={v => setValue(v)}>
        <Option value="apple">Apple</Option>
        <Option value="banana">Banana</Option>
        <Option value="cherry">Cherry</Option>
        <Option value="durian" disabled>Durian</Option>
      </DropdownMenu>
    </div>
  );
};

export default DropdownMenuExample;
`,
});

export const MultiSelect = LiveEditStory({
  component: DropdownMenu,
  code: `import React from 'react';
import { DropdownMenu, Option } from '@aknishi/akds-reactkit';

const DropdownMenuExample = () => {
  const [values, setValues] = React.useState([]);
  return (
    <div style={{ minHeight: '200px'}}>
      <DropdownMenu label="Toppings" multiple selected={values} onChange={v => setValues(v)}>
        <Option value="cheese">Cheese</Option>
        <Option value="tomato">Tomato</Option>
        <Option value="basil">Basil</Option>
        <Option value="anchovies">Anchovies</Option>
      </DropdownMenu>
    </div>
  );
};

export default DropdownMenuExample;
`,
});

export const WithHelperText = LiveEditStory({
  component: DropdownMenu,
  code: `import React from 'react';
import { DropdownMenu, Option } from '@aknishi/akds-reactkit';

const DropdownMenuExample = () => {
  const [value, setValue] = React.useState(undefined);
  return (
    <div style={{ minHeight: '200px'}}>
      <DropdownMenu
        label="Country"
        helperText="Select your country of residence"
        selected={value}
        onChange={v => setValue(v)}
      >
        <Option value="au">Australia</Option>
        <Option value="jp">Japan</Option>
        <Option value="us">United States</Option>
      </DropdownMenu>
    </div>
  );
};

export default DropdownMenuExample;
`,
});

export const Disabled = LiveEditStory({
  component: DropdownMenu,
  code: `import { DropdownMenu, Option } from '@aknishi/akds-reactkit';

const DropdownMenuExample = () => (
  <DropdownMenu label="Country" disabled>
    <Option value="au">Australia</Option>
    <Option value="jp">Japan</Option>
  </DropdownMenu>
);

export default DropdownMenuExample;
`,
});
