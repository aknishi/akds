import { Button } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const button: ComponentEntry = {
  slug: 'button',
  name: 'Button',
  category: 'Actions',
  summary:
    'The primary trigger for actions. Supports three appearances, four emphasis levels, three sizes, loading and disabled states.',
  sourcePath: 'packages/reactkit/src/components/Button',
  storybookId: 'reactkit-buttons-button--docs',
  examples: [
    {
      title: 'Appearances',
      description: 'Solid, bordered, and transparent — pick based on visual hierarchy.',
      render: () => (
        <>
          <Button appearance="solid" emphasis="accented">
            Solid
          </Button>
          <Button appearance="bordered" emphasis="accented">
            Bordered
          </Button>
          <Button appearance="transparent" emphasis="accented">
            Transparent
          </Button>
        </>
      ),
      code: `<Button appearance="solid" emphasis="accented">Solid</Button>
<Button appearance="bordered" emphasis="accented">Bordered</Button>
<Button appearance="transparent" emphasis="accented">Transparent</Button>`,
    },
    {
      title: 'Emphasis',
      description: 'Conveys the intent of the action.',
      render: () => (
        <>
          <Button emphasis="accented">Accented</Button>
          <Button emphasis="neutral">Neutral</Button>
          <Button emphasis="success">Success</Button>
          <Button emphasis="destructive">Destructive</Button>
        </>
      ),
      code: `<Button emphasis="accented">Accented</Button>
<Button emphasis="neutral">Neutral</Button>
<Button emphasis="success">Success</Button>
<Button emphasis="destructive">Destructive</Button>`,
    },
    {
      title: 'Loading & disabled',
      render: () => (
        <>
          <Button loading emphasis="accented">
            Loading
          </Button>
          <Button disabled emphasis="accented">
            Disabled
          </Button>
          <Button disabled focusableWhenDisabled emphasis="accented">
            Disabled, focusable
          </Button>
        </>
      ),
      code: `<Button loading emphasis="accented">Loading</Button>
<Button disabled emphasis="accented">Disabled</Button>
<Button disabled focusableWhenDisabled emphasis="accented">
  Disabled, focusable
</Button>`,
    },
  ],
  accessibilityNotes: [
    'Renders a native <button type="button"> — full keyboard and screen reader support out of the box.',
    'loading sets aria-busy and swaps content for a Spinner while keeping the button non-interactive.',
    'focusableWhenDisabled keeps a disabled button in the tab order (via aria-disabled) so screen reader users can discover why it\'s unavailable, instead of removing it from the tab order entirely.',
    'Ripple and press-scale interactions are skipped automatically when prefers-reduced-motion is set.',
  ],
  props: [
    { name: 'appearance', type: "'solid' | 'transparent' | 'bordered'", default: "'solid'", description: 'Visual style of the button.' },
    { name: 'emphasis', type: "'accented' | 'neutral' | 'success' | 'destructive'", default: "'neutral'", description: 'Conveys the intent of the action.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Controls padding and font size.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Replaces content with a Spinner and blocks interaction.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and applies disabled styling.' },
    { name: 'focusableWhenDisabled', type: 'boolean', default: 'false', description: 'Keeps a disabled button focusable via aria-disabled instead of the native disabled attribute.' },
    { name: 'children', type: 'React.ReactNode', description: 'The button label. Required.' },
  ],
  doDont: [
    { do: 'Use emphasis to convey intent (destructive for delete actions).', dont: "Don't rely on color alone — pair destructive actions with clear copy too." },
    { do: 'Use loading for actions with network latency.', dont: "Don't disable a button without feedback when an action is in flight." },
  ],
  related: ['icon-button', 'like-button', 'toggle-button'],
};
