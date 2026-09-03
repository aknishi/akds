import React from 'react';
import { Combobox } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

const FRAMEWORK_OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular', disabled: true },
];

function ComboboxControlledExample() {
  const [value, setValue] = React.useState('');
  return (
    <Combobox
      options={FRAMEWORK_OPTIONS}
      label="Framework"
      value={value}
      onChange={v => setValue(v as string)}
      helperText={value ? `Selected: ${value}` : 'Type to filter'}
    />
  );
}

export const combobox: ComponentEntry = {
  slug: 'combobox',
  name: 'Combobox',
  category: 'Inputs',
  summary: 'A searchable, typed select — single or multi-select — built from a plain options array.',
  sourcePath: 'packages/reactkit/src/components/Combobox',
  storybookId: 'reactkit-combobox--docs',
  preview: <Combobox label="Framework" options={FRAMEWORK_OPTIONS} placeholder="Choose one" />,
  examples: [
    {
      title: 'Single select',
      render: () => <Combobox label="Framework" options={FRAMEWORK_OPTIONS} placeholder="Choose one" />,
      code: `const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular', disabled: true },
];

<Combobox label="Framework" options={options} placeholder="Choose one" />`,
    },
    {
      title: 'Multi select',
      render: () => <Combobox label="Frameworks" options={FRAMEWORK_OPTIONS} multiple defaultValue={['react']} />,
      code: `<Combobox label="Frameworks" options={options} multiple defaultValue={['react']} />`,
    },
    {
      title: 'Controlled',
      description: 'value and onChange make the selection controlled, driving helperText from the current value.',
      render: () => <ComboboxControlledExample />,
      code: `function Example() {
  const [value, setValue] = React.useState('');
  return (
    <Combobox
      options={options}
      label="Framework"
      value={value}
      onChange={(v) => setValue(v as string)}
      helperText={value ? \`Selected: \${value}\` : 'Type to filter'}
    />
  );
}`,
    },
    {
      title: 'Disabled',
      render: () => <Combobox label="Disabled" options={FRAMEWORK_OPTIONS} disabled defaultValue="react" />,
      code: `<Combobox label="Disabled" options={options} disabled defaultValue="react" />`,
    },
  ],
  accessibilityNotes: [
    'The input is a combobox with an associated listbox popup, following the ARIA combobox pattern.',
    'Typing filters the option list; arrow keys move the active option; Enter selects it; Escape closes the popup.',
    'Provide label (or aria-label) — it is the accessible name for the input.',
  ],
  props: [
    { name: 'options', type: 'ComboboxOption[]', description: 'Array of selectable options. Required.' },
    { name: 'value', type: 'string | string[]', description: 'The currently selected value(s). Makes the component controlled.' },
    { name: 'defaultValue', type: 'string | string[]', description: 'Initial selected value(s) for the uncontrolled case.' },
    { name: 'onChange', type: '(value: string | string[]) => void', description: 'Called when the selection changes.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'When true, multiple options can be selected.' },
    { name: 'label', type: 'string', description: 'Floating label text rendered inside the control.' },
    { name: 'placeholder', type: 'string', description: 'Placeholder shown when no value is selected.' },
    { name: 'helperText', type: 'string', description: 'Helper text rendered below the control.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and applies disabled styling.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: "Expands the control to fill its container's width." },
    { name: 'aria-label', type: 'string', description: 'Accessible label applied to the combobox input when no visible label is provided.' },
  ],
  doDont: [
    { do: 'Use Combobox when the option list is long enough to benefit from search.', dont: "Don't use Combobox for 2-3 options — a RadioGroup is more direct." },
  ],
  related: ['dropdown-menu', 'text-input'],
};
