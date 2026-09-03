import { Flexbox, Checkbox } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const checkbox: ComponentEntry = {
  slug: 'checkbox',
  name: 'Checkbox',
  category: 'Inputs',
  summary: 'A labeled checkbox input with support for indeterminate state and three sizes.',
  sourcePath: 'packages/reactkit/src/components/Checkbox',
  storybookId: 'reactkit-checkbox--docs',
  preview: <Checkbox label="Checked" defaultChecked />,
  examples: [
    {
      title: 'Basic',
      render: () => (
        <>
          <Checkbox label="Unchecked" />
          <Checkbox label="Checked" defaultChecked />
        </>
      ),
      code: `<Checkbox label="Unchecked" />
<Checkbox label="Checked" defaultChecked />`,
    },
    {
      title: 'Indeterminate & disabled',
      render: () => (
        <>
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled checked" disabled defaultChecked />
        </>
      ),
      code: `<Checkbox label="Indeterminate" indeterminate />
<Checkbox label="Disabled" disabled />
<Checkbox label="Disabled checked" disabled defaultChecked />`,
    },
    {
      title: 'Sizes',
      render: () => (
        <Flexbox direction="column" gap="sm">
          <Checkbox label="Small" size="sm" />
          <Checkbox label="Medium" size="md" />
          <Checkbox label="Large" size="lg" />
        </Flexbox>
      ),
      code: `<Flexbox direction="column" gap="sm">
  <Checkbox label="Small" size="sm" />
  <Checkbox label="Medium" size="md" />
  <Checkbox label="Large" size="lg" />
</Flexbox>`,
    },
  ],
  accessibilityNotes: [
    'Renders a real <label> wrapping a native <input type="checkbox"> — no RippleBase or custom ARIA role needed, the browser handles the interaction affordance.',
    'indeterminate is applied imperatively to the underlying input\'s DOM property (not a native HTML attribute) since it only affects visual rendering, not the checked value submitted by a form.',
  ],
  props: [
    { name: 'label', type: 'React.ReactNode', description: 'The label text rendered next to the checkbox.' },
    { name: 'checked', type: 'boolean', description: 'The checked state (controlled).' },
    { name: 'defaultChecked', type: 'boolean', description: 'The default checked state (uncontrolled).' },
    { name: 'onChange', type: 'React.ChangeEventHandler<HTMLInputElement>', description: 'Change handler forwarded to the inner <input>.' },
    { name: 'name', type: 'string', description: 'Name attribute forwarded to the inner <input>.' },
    { name: 'value', type: 'string | ReadonlyArray<string> | number', description: 'Value attribute forwarded to the inner <input>.' },
    { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows the indeterminate state (overrides checked visually).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and applies disabled styling.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Sets the size of the checkbox indicator.' },
  ],
  doDont: [
    { do: 'Use indeterminate for a parent checkbox representing a partial selection.', dont: "Don't set both indeterminate and rely on checked for meaning — indeterminate is visual only." },
  ],
  related: ['radio', 'switch'],
};
