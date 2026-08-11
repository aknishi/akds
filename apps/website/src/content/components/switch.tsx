import { Switch } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const switchEntry: ComponentEntry = {
  slug: 'switch',
  name: 'Switch',
  category: 'Inputs',
  summary: 'A toggle switch for binary on/off settings, with an optional inline label.',
  sourcePath: 'packages/reactkit/src/components/Switch',
  examples: [
    {
      title: 'Basic',
      render: () => (
        <>
          <Switch label="Off" />
          <Switch label="On" defaultChecked />
        </>
      ),
      code: `<Switch label="Off" />
<Switch label="On" defaultChecked />`,
    },
    {
      title: 'Sizes',
      render: () => (
        <>
          <Switch label="Small" size="sm" defaultChecked />
          <Switch label="Medium" size="md" defaultChecked />
          <Switch label="Large" size="lg" defaultChecked />
        </>
      ),
      code: `<Switch label="Small" size="sm" />
<Switch label="Medium" size="md" />
<Switch label="Large" size="lg" />`,
    },
  ],
  accessibilityNotes: [
    'Renders a native <input type="checkbox"> under the hood with switch styling — checked state is announced correctly by screen readers.',
    'The visible label is a real <label>, so clicking the text toggles the switch.',
  ],
  props: [
    { name: 'label', type: 'React.ReactNode', description: 'The label text rendered next to the switch.' },
    { name: 'checked', type: 'boolean', description: 'The checked state (controlled).' },
    { name: 'defaultChecked', type: 'boolean', description: 'The default checked state (uncontrolled).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and applies disabled styling.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Sets the size of the switch.' },
  ],
  doDont: [
    { do: 'Use Switch for settings that take effect immediately.', dont: "Don't use Switch inside a form that requires an explicit Save action — prefer Checkbox there." },
  ],
  related: ['checkbox'],
};
