import React from 'react';
import { Flexbox, ToggleButton, ToggleGroup } from '@aknishi/akds-reactkit';
import { IceCreamIcon, LocalBarIcon, LunchDiningIcon } from '@aknishi/akds-icons';
import type { ComponentEntry } from './types';
import { usePrefersReducedMotion } from '../../lib/usePrefersReducedMotion';
import { useAutoRestartInterval } from '../../lib/useAutoRestartInterval';
import { AUTO_LOOP_INTERVAL_MS, AUTO_LOOP_STAGGER_MS } from './autoLoopTiming';

const TOGGLE_GROUP_AUTO_LOOP_VALUES = ['day', 'week'];

// Cycles the selection on a loop for the index page's otherwise-static card preview
// (replays the sliding-indicator transition) — see AUTO_LOOP_INTERVAL_MS for why
// 3s/staggered.
function ToggleGroupAutoLoopPreview() {
  const [value, setValue] = React.useState(TOGGLE_GROUP_AUTO_LOOP_VALUES[0]);
  const prefersReducedMotion = usePrefersReducedMotion();
  useAutoRestartInterval(
    () => setValue((current) => TOGGLE_GROUP_AUTO_LOOP_VALUES[(TOGGLE_GROUP_AUTO_LOOP_VALUES.indexOf(current) + 1) % TOGGLE_GROUP_AUTO_LOOP_VALUES.length]),
    AUTO_LOOP_INTERVAL_MS,
    !prefersReducedMotion,
    3 * AUTO_LOOP_STAGGER_MS,
  );
  return (
    <ToggleGroup value={value} onChange={setValue}>
      <ToggleButton value="day">Day</ToggleButton>
      <ToggleButton value="week">Week</ToggleButton>
    </ToggleGroup>
  );
}

function ToggleGroupExample() {
  const [value, setValue] = React.useState('day');
  return (
    <ToggleGroup value={value} onChange={setValue}>
      <ToggleButton value="day">Day</ToggleButton>
      <ToggleButton value="week">Week</ToggleButton>
      <ToggleButton value="month">Month</ToggleButton>
    </ToggleGroup>
  );
}

export const toggleGroup: ComponentEntry = {
  slug: 'toggle-group',
  name: 'Toggle group',
  category: 'Inputs',
  summary:
    'A segmented control wrapping two or more Toggle button children, where only one option can be selected at a time.',
  sourcePath: 'packages/reactkit/src/components/ToggleGroup',
  storybookId: 'reactkit-toggle-togglegroup--docs',
  preview: <ToggleGroupAutoLoopPreview />,
  examples: [
    {
      title: 'Controlled',
      render: () => <ToggleGroupExample />,
      code: `function Example() {
  const [value, setValue] = React.useState('day');
  return (
    <ToggleGroup value={value} onChange={setValue}>
      <ToggleButton value="day">Day</ToggleButton>
      <ToggleButton value="week">Week</ToggleButton>
      <ToggleButton value="month">Month</ToggleButton>
    </ToggleGroup>
  );
}`,
    },
    {
      title: 'With icons and a disabled option',
      render: () => (
        <ToggleGroup defaultValue="drinks">
          <ToggleButton value="drinks">
            <LocalBarIcon />
            Drinks
          </ToggleButton>
          <ToggleButton value="food">
            <LunchDiningIcon />
            Food
          </ToggleButton>
          <ToggleButton value="dessert" disabled>
            <IceCreamIcon />
            Dessert
          </ToggleButton>
        </ToggleGroup>
      ),
      code: `<ToggleGroup defaultValue="drinks">
  <ToggleButton value="drinks"><LocalBarIcon />Drinks</ToggleButton>
  <ToggleButton value="food"><LunchDiningIcon />Food</ToggleButton>
  <ToggleButton value="dessert" disabled><IceCreamIcon />Dessert</ToggleButton>
</ToggleGroup>`,
    },
    {
      title: 'Sizes',
      render: () => (
        <Flexbox direction="column" gap="md" align="flex-start">
          <ToggleGroup size="sm" defaultValue="list">
            <ToggleButton value="list">List</ToggleButton>
            <ToggleButton value="grid">Grid</ToggleButton>
          </ToggleGroup>
          <ToggleGroup size="md" defaultValue="list">
            <ToggleButton value="list">List</ToggleButton>
            <ToggleButton value="grid">Grid</ToggleButton>
          </ToggleGroup>
          <ToggleGroup size="lg" defaultValue="list">
            <ToggleButton value="list">List</ToggleButton>
            <ToggleButton value="grid">Grid</ToggleButton>
          </ToggleGroup>
        </Flexbox>
      ),
      code: `<Flexbox direction="column" gap="md" align="flex-start">
  <ToggleGroup size="sm" defaultValue="list">
    <ToggleButton value="list">List</ToggleButton>
    <ToggleButton value="grid">Grid</ToggleButton>
  </ToggleGroup>
  <ToggleGroup size="md" defaultValue="list">
    <ToggleButton value="list">List</ToggleButton>
    <ToggleButton value="grid">Grid</ToggleButton>
  </ToggleGroup>
  <ToggleGroup size="lg" defaultValue="list">
    <ToggleButton value="list">List</ToggleButton>
    <ToggleButton value="grid">Grid</ToggleButton>
  </ToggleGroup>
</Flexbox>`,
    },
    {
      title: 'Disabled',
      description: 'Setting disabled on the group disables every child Toggle button, regardless of their own disabled prop.',
      render: () => (
        <ToggleGroup defaultValue="drinks" disabled>
          <ToggleButton value="drinks">
            <LocalBarIcon />
            Drinks
          </ToggleButton>
          <ToggleButton value="food">
            <LunchDiningIcon />
            Food
          </ToggleButton>
        </ToggleGroup>
      ),
      code: `<ToggleGroup defaultValue="drinks" disabled>
  <ToggleButton value="drinks"><LocalBarIcon />Drinks</ToggleButton>
  <ToggleButton value="food"><LunchDiningIcon />Food</ToggleButton>
</ToggleGroup>`,
    },
  ],
  accessibilityNotes: [
    'Renders as an ARIA radiogroup — each Toggle button child becomes role="radio" with aria-checked, so only one option is ever selected.',
    'Supports full keyboard navigation: Arrow keys move between options, Home/End jump to the first/last enabled option.',
    "Grouped Toggle button children ignore their own disabled/size props unless set — the group's size and disabled propagate to every child.",
  ],
  props: [
    { name: 'value', type: 'string', description: 'The currently selected value (controlled).' },
    { name: 'defaultValue', type: 'string', description: 'The initially selected value (uncontrolled).' },
    { name: 'onChange', type: '(value: string) => void', description: "Called with a button's value when the selection changes." },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'When true, disables all child Toggle button components.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Sets the size applied to all child Toggle button components.' },
    { name: 'children', type: 'React.ReactNode', description: 'Toggle button components to render inside the group. Required.' },
  ],
  doDont: [
    { do: 'Use Toggle group for a small, fixed set of mutually exclusive options (view mode, time range).', dont: "Don't use Toggle group as a substitute for Tabs — it selects a value, it doesn't switch page content." },
  ],
  related: ['toggle-button', 'radio', 'tabs'],
};
