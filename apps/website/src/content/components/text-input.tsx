import { TextInput } from '@aknishi/akds-reactkit';
import { SearchIcon } from '@aknishi/akds-icons';
import type { ComponentEntry } from './types';

export const textInput: ComponentEntry = {
  slug: 'text-input',
  name: 'Text input',
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
    {
      title: 'Disabled',
      render: () => <TextInput label="Read only" disabled />,
      code: `<TextInput label="Read only" disabled />`,
    },
  ],
  accessibilityNotes: [
    'The floating label is a real <label> associated with the input via htmlFor/id — always announced by screen readers.',
    'With error set, helperText becomes the error message: it is prefixed with an error icon named "Error" (so the state is not conveyed by color alone), linked via aria-describedby, and aria-invalid="true" is set.',
    'Native constraints (required, pattern, type, minLength…) pass through via ...rest. A failing field gets the same error styling via :user-invalid — only after the user edits and leaves it, or on a failed submit — plus aria-invalid="true" and the browser validation message below the helper text. Until then aria-invalid is "false".',
    'A consumer aria-describedby is merged with the helper and error message ids rather than replacing them.',
    'All other native <input> attributes (autoComplete, name, etc.) pass through via ...rest.',
  ],
  props: [
    { name: 'label', type: 'string', description: 'The floating label text.' },
    { name: 'helperText', type: 'string', description: 'Helper text rendered below the input.' },
    { name: 'startAdornment', type: 'React.ReactNode', description: 'Element rendered before the input, e.g. an icon.' },
    { name: 'error', type: 'boolean', default: 'false', description: 'Applies error styling to the border and helper text.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and applies disabled styling.' },
    { name: 'wrapperClassName', type: 'string', description: 'className applied to the outer wrapper <div>.' },
    { name: 'inputRef', type: 'React.Ref<HTMLInputElement>', description: 'Ref forwarded to the internal <input> element.' },
  ],
  doDont: [
    { do: 'Always provide a label — it doubles as the accessible name.', dont: "Don't use placeholder text as a substitute for a label." },
    { do: 'Pair error with helperText explaining what to fix.', dont: "Don't set error without any accompanying message." },
  ],
  related: ['text-area', 'checkbox', 'combobox'],
};
