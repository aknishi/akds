import React from 'react';
import { Switch } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';
import { useAutoRestartInterval } from '../../lib/useAutoRestartInterval';
import { AUTO_LOOP_INTERVAL_MS, AUTO_LOOP_STAGGER_MS } from './autoLoopTiming';

// Flips checked on a loop for the index page's otherwise-static card preview — see
// AUTO_LOOP_INTERVAL_MS for why 3s/staggered.
function SwitchAutoLoopPreview() {
  const [checked, setChecked] = React.useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();
  useAutoRestartInterval(() => setChecked((c) => !c), AUTO_LOOP_INTERVAL_MS, !prefersReducedMotion, 2 * AUTO_LOOP_STAGGER_MS);
  return <Switch label="Enabled" checked={checked} onChange={() => {}} />;
}

function SwitchControlledExample() {
  const [enabled, setEnabled] = React.useState(false);
  return (
    <Switch
      label={enabled ? 'Dark mode on' : 'Dark mode off'}
      checked={enabled}
      onChange={e => setEnabled(e.target.checked)}
    />
  );
}

export const switchEntry: ComponentEntry = {
  slug: 'switch',
  name: 'Switch',
  category: 'Inputs',
  summary: 'A toggle switch for binary on/off settings, with an optional inline label.',
  sourcePath: 'packages/reactkit/src/components/Switch',
  storybookId: 'reactkit-switch--docs',
  preview: <SwitchAutoLoopPreview />,
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
      code: `<Switch label="Small" size="sm" defaultChecked />
<Switch label="Medium" size="md" defaultChecked />
<Switch label="Large" size="lg" defaultChecked />`,
    },
    {
      title: 'States',
      render: () => (
        <>
          <Switch label="Off" />
          <Switch label="On" defaultChecked />
          <Switch label="Disabled off" disabled />
          <Switch label="Disabled on" disabled defaultChecked />
        </>
      ),
      code: `<Switch label="Off" />
<Switch label="On" defaultChecked />
<Switch label="Disabled off" disabled />
<Switch label="Disabled on" disabled defaultChecked />`,
    },
    {
      title: 'Controlled',
      render: () => <SwitchControlledExample />,
      code: `function Example() {
  const [enabled, setEnabled] = React.useState(false);
  return (
    <Switch
      label={enabled ? 'Dark mode on' : 'Dark mode off'}
      checked={enabled}
      onChange={(e) => setEnabled(e.target.checked)}
    />
  );
}`,
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
    { name: 'onChange', type: 'React.ChangeEventHandler<HTMLInputElement>', description: 'Change handler forwarded to the inner <input>.' },
    { name: 'name', type: 'string', description: 'Name attribute forwarded to the inner <input>.' },
    { name: 'value', type: 'string', description: 'Value attribute forwarded to the inner <input>.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and applies disabled styling.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Sets the size of the switch.' },
  ],
  doDont: [
    { do: 'Use Switch for settings that take effect immediately.', dont: "Don't use Switch inside a form that requires an explicit Save action — prefer Checkbox there." },
  ],
  related: ['checkbox'],
};
