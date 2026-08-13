import { Button, Tooltip } from '@aknishi/akds-reactkit';
import type { ComponentEntry } from './types';

export const tooltip: ComponentEntry = {
  slug: 'tooltip',
  name: 'Tooltip',
  category: 'Feedback & Overlay',
  summary: 'A hover/focus tooltip attached to a single trigger element, with configurable placement.',
  sourcePath: 'packages/reactkit/src/components/Tooltip',
  storybookId: 'reactkit-tooltip--docs',
  examples: [
    {
      title: 'Placements',
      render: () => (
        <>
          <Tooltip content="Top tooltip" placement="top">
            <Button appearance="bordered" emphasis="neutral">
              Top
            </Button>
          </Tooltip>
          <Tooltip content="Right tooltip" placement="right">
            <Button appearance="bordered" emphasis="neutral">
              Right
            </Button>
          </Tooltip>
        </>
      ),
      code: `<Tooltip content="Top tooltip" placement="top">
  <Button appearance="bordered" emphasis="neutral">Top</Button>
</Tooltip>`,
    },
  ],
  accessibilityNotes: [
    'Tooltip shows on both hover and keyboard focus of its trigger — not hover-only — so keyboard users see the same content.',
    'content is associated with the trigger via aria-describedby, not just visual proximity.',
    'children must be a single React element capable of receiving a ref and event handlers.',
  ],
  props: [
    { name: 'content', type: 'React.ReactNode', description: 'The tooltip text or content displayed on hover/focus. Required.' },
    { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Which side of the trigger the tooltip appears on.' },
    { name: 'children', type: 'React.ReactElement', description: 'The single interactive element that triggers the tooltip. Required.' },
  ],
  doDont: [
    { do: 'Use Tooltip for supplementary context on an already-labeled control.', dont: "Don't hide essential information only in a Tooltip — touch users can't hover." },
  ],
  related: ['icon-button'],
};
