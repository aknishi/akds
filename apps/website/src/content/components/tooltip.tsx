import { Button, Flexbox, IconButton, Tooltip } from '@aknishi/akds-reactkit';
import { CopyIcon } from '@aknishi/akds-icons';
import type { ComponentEntry } from './types';

export const tooltip: ComponentEntry = {
  slug: 'tooltip',
  name: 'Tooltip',
  category: 'Overlay',
  summary: 'A hover/focus tooltip attached to a single trigger element, with configurable placement.',
  sourcePath: 'packages/reactkit/src/components/Tooltip',
  storybookId: 'reactkit-tooltip--docs',
  preview: (
    // Tooltip is absolutely positioned above the trigger and isn't counted by the
    // preview container's flex centering, so the pair reads as too high without a nudge.
    // The nudge goes on a wrapper *outside* Tooltip, not on the trigger itself — margin
    // on the trigger would grow Tooltip's own auto-sized wrapper (margin counts toward a
    // flex item's contribution to its container's size), which would push the pill's
    // anchor point up and visibly detach it from the trigger.
    <div style={{ marginTop: 'var(--akds-spacing-200)' }}>
      <Tooltip content="Copy" open>
        <IconButton appearance="transparent" emphasis="neutral" aria-label="Copy">
          <CopyIcon />
        </IconButton>
      </Tooltip>
    </div>
  ),
  examples: [
    {
      title: 'Placements',
      render: () => (
        <Flexbox justify='space-around' gap="xl" align="center" wrap style={{width: '100%'}}>
          <Tooltip content="Top tooltip" placement="top">
            <Button appearance="bordered" emphasis="neutral">
              Top
            </Button>
          </Tooltip>
          <Tooltip content="Bottom tooltip" placement="bottom">
            <Button appearance="bordered" emphasis="neutral">
              Bottom
            </Button>
          </Tooltip>
          <Tooltip content="Left tooltip" placement="left">
            <Button appearance="bordered" emphasis="neutral">
              Left
            </Button>
          </Tooltip>
          <Tooltip content="Right tooltip" placement="right">
            <Button appearance="bordered" emphasis="neutral">
              Right
            </Button>
          </Tooltip>
        </Flexbox>
      ),
      code: `<Flexbox gap="lg" align="center">
  <Tooltip content="Top tooltip" placement="top">
    <Button appearance="bordered" emphasis="neutral">Top</Button>
  </Tooltip>
  <Tooltip content="Bottom tooltip" placement="bottom">
    <Button appearance="bordered" emphasis="neutral">Bottom</Button>
  </Tooltip>
  <Tooltip content="Left tooltip" placement="left">
    <Button appearance="bordered" emphasis="neutral">Left</Button>
  </Tooltip>
  <Tooltip content="Right tooltip" placement="right">
    <Button appearance="bordered" emphasis="neutral">Right</Button>
  </Tooltip>
</Flexbox>`,
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
