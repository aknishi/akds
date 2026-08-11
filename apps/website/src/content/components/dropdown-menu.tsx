import { DropdownMenu, Option } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const dropdownMenu: ComponentEntry = {
  slug: 'dropdown-menu',
  name: 'DropdownMenu',
  category: 'Inputs',
  summary: 'A select-style trigger that opens a Menu of Option children — the fixed-option counterpart to Combobox.',
  sourcePath: 'packages/reactkit/src/components/DropdownMenu',
  examples: [
    {
      title: 'Basic',
      render: () => (
        <DropdownMenu label="Status" placeholder="Select status" selected="open">
          <Option value="open">Open</Option>
          <Option value="in-progress">In progress</Option>
          <Option value="closed">Closed</Option>
        </DropdownMenu>
      ),
      code: `<DropdownMenu label="Status" placeholder="Select status" selected="open">
  <Option value="open">Open</Option>
  <Option value="in-progress">In progress</Option>
  <Option value="closed">Closed</Option>
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
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches the component to fill its parent container.' },
    { name: 'children', type: 'React.ReactNode', description: 'Option elements. Required.' },
  ],
  doDont: [
    { do: 'Use DropdownMenu when the option set is small and known ahead of time.', dont: "Don't duplicate a DropdownMenu's options in a Combobox — pick one based on whether search is needed." },
  ],
  related: ['combobox', 'menu'],
};
