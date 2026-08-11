import { Combobox } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

const FRAMEWORK_OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular', disabled: true },
];

export const combobox: ComponentEntry = {
  slug: 'combobox',
  name: 'Combobox',
  category: 'Inputs',
  summary: 'A searchable, typed select — single or multi-select — built from a plain options array.',
  sourcePath: 'packages/reactkit/src/components/Combobox',
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
  ],
  accessibilityNotes: [
    'The input is a combobox with an associated listbox popup, following the ARIA combobox pattern.',
    'Typing filters the option list; arrow keys move the active option; Enter selects it; Escape closes the popup.',
    'Provide label (or aria-label) — it is the accessible name for the input.',
  ],
  props: [
    { name: 'options', type: 'ComboboxOption[]', description: 'Array of selectable options. Required.' },
    { name: 'value', type: 'string | string[]', description: 'The currently selected value(s). Makes the component controlled.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'When true, multiple options can be selected.' },
    { name: 'label', type: 'string', description: 'Floating label text rendered inside the control.' },
    { name: 'placeholder', type: 'string', description: 'Placeholder shown when no value is selected.' },
    { name: 'helperText', type: 'string', description: 'Helper text rendered below the control.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and applies disabled styling.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: "Expands the control to fill its container's width." },
  ],
  doDont: [
    { do: 'Use Combobox when the option list is long enough to benefit from search.', dont: "Don't use Combobox for 2-3 options — a RadioGroup is more direct." },
  ],
  related: ['dropdown-menu', 'text-input'],
};
