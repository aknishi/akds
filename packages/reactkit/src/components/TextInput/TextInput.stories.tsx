import type { Meta } from '@storybook/react-vite';
import { TextInput } from './TextInput';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    label: { control: 'text' },
    helperText: { control: 'text' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: TextInput,
  code: `import { TextInput } from '@aknishi/akds-reactkit';

const TextInputExample = () => <TextInput label="Email address" />;

export default TextInputExample;
`,
});

export const WithHelperText = LiveEditStory({
  component: TextInput,
  code: `import { TextInput } from '@aknishi/akds-reactkit';

const TextInputExample = () => (
  <TextInput label="Username" helperText="Must be at least 3 characters" />
);

export default TextInputExample;
`,
});

export const WithStartAdornment = LiveEditStory({
  component: TextInput,
  code: `import { TextInput } from '@aknishi/akds-reactkit';

const TextInputExample = () => (
  <TextInput label="Amount" startAdornment="$" />
);

export default TextInputExample;
`,
});

export const Error = LiveEditStory({
  component: TextInput,
  code: `import { TextInput } from '@aknishi/akds-reactkit';

const TextInputExample = () => (
  <TextInput label="Email address" defaultValue="invalid address" helperText="Enter a valid email address" error />
);

export default TextInputExample;
`,
});

export const Disabled = LiveEditStory({
  component: TextInput,
  code: `import { TextInput } from '@aknishi/akds-reactkit';

const TextInputExample = () => <TextInput label="Read only" disabled />;

export default TextInputExample;
`,
});
