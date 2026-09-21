import React from 'react';
import { Radio, RadioGroup } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';
import { useAutoRestartInterval } from '../../lib/useAutoRestartInterval';
import { AUTO_LOOP_INTERVAL_MS, AUTO_LOOP_STAGGER_MS } from './autoLoopTiming';

const RADIO_AUTO_LOOP_VALUES = ['free', 'pro'];

// Cycles the selected option on a loop for the index page's otherwise-static card
// preview — see AUTO_LOOP_INTERVAL_MS for why 3s/staggered.
function RadioAutoLoopPreview() {
  const [value, setValue] = React.useState(RADIO_AUTO_LOOP_VALUES[1]);
  const prefersReducedMotion = usePrefersReducedMotion();
  useAutoRestartInterval(
    () => setValue((current) => RADIO_AUTO_LOOP_VALUES[(RADIO_AUTO_LOOP_VALUES.indexOf(current) + 1) % RADIO_AUTO_LOOP_VALUES.length]),
    AUTO_LOOP_INTERVAL_MS,
    !prefersReducedMotion,
    1 * AUTO_LOOP_STAGGER_MS,
  );
  return (
    <RadioGroup name="preview-plan" value={value} onChange={(e) => setValue(e.target.value)} legend="Plan">
      <Radio label="Free" value="free" />
      <Radio label="Pro" value="pro" />
    </RadioGroup>
  );
}

export const radio: ComponentEntry = {
  slug: 'radio',
  name: 'Radio',
  category: 'Inputs',
  summary: 'A single radio input, typically composed inside RadioGroup which manages shared name and selection.',
  sourcePath: 'packages/reactkit/src/components/Radio',
  storybookId: 'reactkit-radio--docs',
  preview: <RadioAutoLoopPreview />,
  examples: [
    {
      title: 'RadioGroup',
      render: () => (
        <RadioGroup name="plan" defaultValue="pro" legend="Plan">
          <Radio label="Free" value="free" />
          <Radio label="Pro" value="pro" />
          <Radio label="Enterprise" value="enterprise" />
        </RadioGroup>
      ),
      code: `<RadioGroup name="plan" defaultValue="pro" legend="Plan">
  <Radio label="Free" value="free" />
  <Radio label="Pro" value="pro" />
  <Radio label="Enterprise" value="enterprise" />
</RadioGroup>`,
    },
    {
      title: 'Horizontal orientation',
      render: () => (
        <RadioGroup name="delivery-horizontal" defaultValue="express" orientation="horizontal">
          <Radio label="Standard" value="standard" />
          <Radio label="Express" value="express" />
          <Radio label="Overnight" value="overnight" />
        </RadioGroup>
      ),
      code: `<RadioGroup name="delivery" orientation="horizontal">
  <Radio label="Standard" value="standard" />
  <Radio label="Express" value="express" />
  <Radio label="Overnight" value="overnight" />
</RadioGroup>`,
    },
    {
      title: 'Disabled',
      description: 'Setting disabled on RadioGroup disables every child Radio.',
      render: () => (
        <RadioGroup name="disabled-group" disabled>
          <Radio label="Option A" value="a" />
          <Radio label="Option B" value="b" />
        </RadioGroup>
      ),
      code: `<RadioGroup name="disabled-group" disabled>
  <Radio label="Option A" value="a" />
  <Radio label="Option B" value="b" />
</RadioGroup>`,
    },
  ],
  accessibilityNotes: [
    'RadioGroup renders a native <fieldset>, with legend rendered as a real <legend> — the accessible name for the whole group.',
    'name, disabled, and onChange set on RadioGroup are inherited by every child Radio unless a Radio explicitly overrides them.',
    'Arrow-key navigation between radios in the same group is native browser behavior, not custom JS.',
  ],
  props: [
    { name: 'name', type: 'string', description: 'Shared name for all child Radio inputs. Required on RadioGroup for form association.' },
    { name: 'value', type: 'string | number', description: 'The currently selected value (controlled), set on RadioGroup.' },
    { name: 'onChange', type: 'React.ChangeEventHandler<HTMLInputElement>', description: 'Change handler called when a Radio option is selected, set on RadioGroup.' },
    { name: 'legend', type: 'React.ReactNode', description: 'Accessible label rendered as a <legend> on RadioGroup.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'When set on RadioGroup, disables all child Radio inputs. Can also be set on an individual Radio.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'vertical'", description: 'Layout direction of the radio options, set on RadioGroup.' },
    { name: 'label', type: 'React.ReactNode', description: 'The label text rendered next to an individual Radio.' },
    { name: 'checked', type: 'boolean', description: 'The checked state of an individual Radio (controlled). Overrides RadioGroup value matching.' },
    { name: 'defaultChecked', type: 'boolean', description: 'The default checked state of an individual Radio (uncontrolled).' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Sets the size of the radio indicator.' },
  ],
  doDont: [
    { do: 'Wrap Radio options in a RadioGroup for a real <fieldset>/<legend> pairing.', dont: "Don't use a single standalone Radio for a binary choice — use Switch or Checkbox instead." },
  ],
  related: ['checkbox', 'switch', 'toggle-group'],
};
