import React from 'react';
import { DropdownMenu, Option } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

function DropdownMenuExample() {
  const [selected, setSelected] = React.useState('open');
  return (
    <DropdownMenu label="Status" placeholder="Select status" selected={selected} onChange={value => setSelected(value as string)}>
      <Option value="open">Open</Option>
      <Option value="in-progress">In progress</Option>
      <Option value="closed">Closed</Option>
      <Option value="archived" disabled>Archived</Option>
    </DropdownMenu>
  );
}

function DropdownMenuMultiSelectExample() {
  const [values, setValues] = React.useState<string[]>([]);
  return (
    <DropdownMenu label="Toppings" multiple selected={values} onChange={value => setValues(value as string[])}>
      <Option value="cheese">Cheese</Option>
      <Option value="tomato">Tomato</Option>
      <Option value="basil">Basil</Option>
      <Option value="anchovies">Anchovies</Option>
    </DropdownMenu>
  );
}

function DropdownMenuHelperTextExample() {
  const [value, setValue] = React.useState<string | undefined>(undefined);
  return (
    <DropdownMenu
      label="Country"
      helperText="Select your country of residence"
      selected={value}
      onChange={v => setValue(v as string)}
    >
      <Option value="au">Australia</Option>
      <Option value="jp">Japan</Option>
      <Option value="us">United States</Option>
    </DropdownMenu>
  );
}

export const dropdownMenu: ComponentEntry = {
  slug: 'dropdown-menu',
  name: 'Dropdown menu',
  category: 'Inputs',
  summary: 'A select-style trigger that opens a Menu of Option children — the fixed-option counterpart to Combobox.',
  sourcePath: 'packages/reactkit/src/components/DropdownMenu',
  storybookId: 'reactkit-dropdownmenu--docs',
  preview: (
    <DropdownMenu label="Status" selected="open">
      <Option value="open">Open</Option>
      <Option value="closed">Closed</Option>
    </DropdownMenu>
  ),
  examples: [
    {
      title: 'Basic',
      description: 'Option accepts disabled just like a Combobox option.',
      render: () => <DropdownMenuExample />,
      code: `function Example() {
  const [selected, setSelected] = React.useState('open');
  return (
    <DropdownMenu label="Status" placeholder="Select status" selected={selected} onChange={setSelected}>
      <Option value="open">Open</Option>
      <Option value="in-progress">In progress</Option>
      <Option value="closed">Closed</Option>
      <Option value="archived" disabled>Archived</Option>
    </DropdownMenu>
  );
}`,
    },
    {
      title: 'Multi select',
      render: () => <DropdownMenuMultiSelectExample />,
      code: `function Example() {
  const [values, setValues] = React.useState([]);
  return (
    <DropdownMenu label="Toppings" multiple selected={values} onChange={setValues}>
      <Option value="cheese">Cheese</Option>
      <Option value="tomato">Tomato</Option>
      <Option value="basil">Basil</Option>
      <Option value="anchovies">Anchovies</Option>
    </DropdownMenu>
  );
}`,
    },
    {
      title: 'Helper text',
      render: () => <DropdownMenuHelperTextExample />,
      code: `function Example() {
  const [value, setValue] = React.useState(undefined);
  return (
    <DropdownMenu
      label="Country"
      helperText="Select your country of residence"
      selected={value}
      onChange={setValue}
    >
      <Option value="au">Australia</Option>
      <Option value="jp">Japan</Option>
      <Option value="us">United States</Option>
    </DropdownMenu>
  );
}`,
    },
    {
      title: 'Disabled',
      render: () => (
        <DropdownMenu label="Country" disabled>
          <Option value="au">Australia</Option>
          <Option value="jp">Japan</Option>
        </DropdownMenu>
      ),
      code: `<DropdownMenu label="Country" disabled>
  <Option value="au">Australia</Option>
  <Option value="jp">Japan</Option>
</DropdownMenu>`,
    },
  ],
  accessibilityNotes: [
    'Follows the same ARIA combobox/listbox pattern as Combobox, but options are fixed React children instead of a data array.',
    'The trigger button announces the selected option as its accessible value; Option elements are role="option" with aria-selected.',
  ],
  props: [
    { name: 'selected', type: 'string | string[]', description: 'The currently selected value — always controlled.' },
    { name: 'onChange', type: '(value: string | string[]) => void', description: 'Called with the new value whenever the selection changes.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'When true, multiple options can be selected simultaneously.' },
    { name: 'label', type: 'string', description: 'Floating label shown above the selected value.' },
    { name: 'placeholder', type: 'string', description: 'Placeholder text shown when nothing is selected.' },
    { name: 'open', type: 'boolean', description: 'Controls the open state externally. If omitted, open state is managed internally.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state should change.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and applies disabled styling.' },
    { name: 'helperText', type: 'string', description: 'Helper text rendered below the control.' },
    { name: 'name', type: 'string', description: 'Name attribute for form association.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches the component to fill its parent container.' },
    { name: 'children', type: 'React.ReactNode', description: 'Option elements. Required.' },
    { name: 'aria-label', type: 'string', description: 'Accessible name when no label prop is provided.' },
  ],
  doDont: [
    { do: 'Use Dropdown menu when the option set is small and known ahead of time.', dont: "Don't duplicate a Dropdown menu's options in a Combobox — pick one based on whether search is needed." },
  ],
  related: ['combobox', 'menu'],
};
