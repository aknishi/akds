import type { Meta } from '@storybook/react-vite';
import { Combobox } from './Combobox';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Combobox> = {
  title: 'Reactkit/Combobox',
  component: Combobox,
  argTypes: {
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Combobox,
  code: `import { Combobox } from '@aknishi/akds-reactkit';

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
];

const Example = () => (
  <div style={{ height: '250px' }}>
    <Combobox options={fruits} label="Fruit" />
  </div>
);

export default Example;
`,
});

export const SingleSelect = LiveEditStory({
  component: Combobox,
  code: `import React from 'react';
import { Combobox } from '@aknishi/akds-reactkit';

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
];

const Example = () => {
  const [value, setValue] = React.useState('');
  return (
    <div style={{ height: '250px' }}>
      <Combobox
        options={options}
        label="Framework"
        value={value}
        onChange={(v) => setValue(v as string)}
        helperText={value ? \`Selected: \${value}\` : 'Type to filter'}
      />
    </div>
  );
};

export default Example;
`,
});

export const MultiSelect = LiveEditStory({
  component: Combobox,
  code: `import React from 'react';
import { Combobox } from '@aknishi/akds-reactkit';

const options = [
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'py', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

const Example = () => {
  const [value, setValue] = React.useState([]);
  return (
    <div style={{ height: '250px' }}>
      <Combobox
        options={options}
        label="Languages"
        multiple
        value={value}
        onChange={(v) => setValue(v as string[])}
      />
    </div>
  );
};

export default Example;
`,
});

export const WithDisabledOption = LiveEditStory({
  component: Combobox,
  code: `import { Combobox } from '@aknishi/akds-reactkit';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B', disabled: true },
  { value: 'c', label: 'Option C' },
];

const Example = () => (
  <div style={{ height: '250px' }}>
    <Combobox options={options} label="Choose" helperText="Option B is disabled" />
  </div>
);

export default Example;
`,
});

export const Disabled = LiveEditStory({
  component: Combobox,
  code: `import { Combobox } from '@aknishi/akds-reactkit';

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

const Example = () => (
  <div style={{ height: '250px' }}>
    <Combobox options={options} label="Disabled" disabled defaultValue="a" />
  </div>
);

export default Example;
`,
});
