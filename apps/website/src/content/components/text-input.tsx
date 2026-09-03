import { TextInput } from '@aknishi/akds-reactkit';
import { SearchIcon } from '@aknishi/akds-icons';
import type { ComponentEntry } from './types';

export const textInput: ComponentEntry = {
  slug: 'text-input',
  name: 'TextInput',
  category: 'Inputs',
  summary: 'A text field with a floating label, helper text, error state, and optional start adornment.',
  sourcePath: 'packages/reactkit/src/components/TextInput',
  storybookId: 'reactkit-textinput--docs',
  preview: <TextInput label="Email" />,
  examples: [
    {
      title: 'Basic',
      render: () => <TextInput label="Email address" />,
      code: `<TextInput label="Email address" />`,
    },
    {
      title: 'Helper text & error',
      render: () => (
        <>
          <TextInput label="Username" helperText="Choose a unique username" />
          <TextInput label="Password" error helperText="Password must be at least 8 characters" />
        </>
      ),
      code: `<TextInput label="Username" helperText="Choose a unique username" />
<TextInput label="Password" error helperText="Password must be at least 8 characters" />`,
    },
    {
      title: 'Start adornment',
      render: () => <TextInput label="Search" startAdornment={<SearchIcon size="sm" />} />,
      code: `<TextInput label="Search" startAdornment={<SearchIcon size="sm" />} />`,
    },
  ],
  accessibilityNotes: [
    'The floating label is a real <label> associated with the input via htmlFor/id — always announced by screen readers.',
    'error styling is visual only; pair it with helperText describing the problem so the association is conveyed via aria-describedby, not color alone.',
    'All native <input> attributes (type, required, autoComplete, etc.) pass through via ...rest.',
  ],
  props: [
    { name: 'label', type: 'string', description: 'The floating label text.' },
    { name: 'helperText', type: 'string', description: 'Helper text rendered below the input.' },
    { name: 'startAdornment', type: 'React.ReactNode', description: 'Element rendered before the input, e.g. an icon.' },
    { name: 'error', type: 'boolean', default: 'false', description: 'Applies error styling to the border and helper text.' },
    { name: 'wrapperClassName', type: 'string', description: 'className applied to the outer wrapper <div>.' },
    { name: 'inputRef', type: 'React.Ref<HTMLInputElement>', description: 'Ref forwarded to the internal <input> element.' },
  ],
  doDont: [
    { do: 'Always provide a label — it doubles as the accessible name.', dont: "Don't use placeholder text as a substitute for a label." },
    { do: 'Pair error with helperText explaining what to fix.', dont: "Don't set error without any accompanying message." },
  ],
  related: ['text-area', 'checkbox', 'combobox'],
};
