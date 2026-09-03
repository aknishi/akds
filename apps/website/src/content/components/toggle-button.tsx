import React from 'react';
import { Flexbox, ToggleButton } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

function ToggleButtonExample() {
  const [bold, setBold] = React.useState(false);
  const [italic, setItalic] = React.useState(true);
  return (
    <Flexbox gap="sm" align="center">
      <ToggleButton pressed={bold} onPressedChange={setBold}>
        Bold
      </ToggleButton>
      <ToggleButton pressed={italic} onPressedChange={setItalic}>
        Italic
      </ToggleButton>
    </Flexbox>
  );
}

export const toggleButton: ComponentEntry = {
  slug: 'toggle-button',
  name: 'Toggle button',
  category: 'Actions',
  summary:
    'A button that toggles between pressed and unpressed. Standalone it fills with a semantic color when pressed; inside a Toggle group it becomes a segmented-control option instead.',
  sourcePath: 'packages/reactkit/src/components/ToggleButton',
  storybookId: 'reactkit-toggle-togglebutton--docs',
  preview: (
    <Flexbox gap="sm" align="center">
      <ToggleButton defaultPressed>Bold</ToggleButton>
      <ToggleButton>Italic</ToggleButton>
    </Flexbox>
  ),
  examples: [
    {
      title: 'Default',
      render: () => <ToggleButton>Bold</ToggleButton>,
      code: `<ToggleButton>Bold</ToggleButton>`,
    },
    {
      title: 'Controlled',
      render: () => <ToggleButtonExample />,
      code: `function Example() {
  const [bold, setBold] = React.useState(false);
  const [italic, setItalic] = React.useState(true);
  return (
    <Flexbox gap="sm" align="center">
      <ToggleButton pressed={bold} onPressedChange={setBold}>Bold</ToggleButton>
      <ToggleButton pressed={italic} onPressedChange={setItalic}>Italic</ToggleButton>
    </Flexbox>
  );
}`,
    },
    {
      title: 'Colors',
      render: () => (
        <Flexbox gap="sm" align="center">
          <ToggleButton color="neutral" defaultPressed>
            Neutral
          </ToggleButton>
          <ToggleButton color="primary" defaultPressed>
            Primary
          </ToggleButton>
          <ToggleButton color="success" defaultPressed>
            Success
          </ToggleButton>
          <ToggleButton color="error" defaultPressed>
            Error
          </ToggleButton>
        </Flexbox>
      ),
      code: `<Flexbox gap="sm" align="center">
  <ToggleButton color="neutral" defaultPressed>Neutral</ToggleButton>
  <ToggleButton color="primary" defaultPressed>Primary</ToggleButton>
  <ToggleButton color="success" defaultPressed>Success</ToggleButton>
  <ToggleButton color="error" defaultPressed>Error</ToggleButton>
</Flexbox>`,
    },
    {
      title: 'Sizes',
      render: () => (
        <Flexbox gap="sm" align="center">
          <ToggleButton size="sm" defaultPressed>
            Small
          </ToggleButton>
          <ToggleButton size="md" defaultPressed>
            Medium
          </ToggleButton>
          <ToggleButton size="lg" defaultPressed>
            Large
          </ToggleButton>
        </Flexbox>
      ),
      code: `<Flexbox gap="sm" align="center">
  <ToggleButton size="sm" defaultPressed>Small</ToggleButton>
  <ToggleButton size="md" defaultPressed>Medium</ToggleButton>
  <ToggleButton size="lg" defaultPressed>Large</ToggleButton>
</Flexbox>`,
    },
    {
      title: 'Disabled',
      render: () => (
        <Flexbox gap="sm" align="center">
          <ToggleButton disabled>Bold</ToggleButton>
          <ToggleButton disabled defaultPressed>
            Italic
          </ToggleButton>
        </Flexbox>
      ),
      code: `<Flexbox gap="sm" align="center">
  <ToggleButton disabled>Bold</ToggleButton>
  <ToggleButton disabled defaultPressed>Italic</ToggleButton>
</Flexbox>`,
    },
  ],
  accessibilityNotes: [
    'Standalone, Toggle button renders aria-pressed to announce its state — pair it with a clear accessible name (visible text or aria-label).',
    'Inside a Toggle group, it instead renders role="radio" with aria-checked, matching the group\'s single-select radiogroup pattern.',
    'The color prop only applies when used standalone — grouped buttons pick up the Toggle group\'s selection styling and ignore color.',
  ],
  props: [
    { name: 'value', type: 'string', description: 'Identifies this button when used inside a Toggle group. Required for grouped usage.' },
    { name: 'pressed', type: 'boolean', description: 'The pressed state when used standalone (controlled). Has no effect inside a Toggle group.' },
    { name: 'defaultPressed', type: 'boolean', default: 'false', description: 'The initial pressed state when used standalone (uncontrolled).' },
    { name: 'onPressedChange', type: '(pressed: boolean) => void', description: 'Called with the next pressed state when used standalone.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and applies disabled styling.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Sets the size. Overridden by the parent Toggle group's size when grouped." },
    { name: 'color', type: "'primary' | 'success' | 'error' | 'neutral'", default: "'neutral'", description: 'Sets the active-state color when used standalone. Has no effect inside a Toggle group.' },
    { name: 'children', type: 'React.ReactNode', description: 'Content rendered inside the button. Required.' },
  ],
  doDont: [
    { do: 'Use standalone Toggle button for independent binary toggles, like formatting toolbar buttons.', dont: "Don't use standalone Toggle button for mutually exclusive options — group them in a Toggle group instead." },
  ],
  related: ['toggle-group', 'button'],
};
