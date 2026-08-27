import type { Meta } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Tooltip> = {
  title: 'Reactkit/Tooltip',
  component: Tooltip,
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    content: { control: 'text' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Tooltip,
  code: `import { Flexbox, Tooltip, Button } from '@aknishi/akds-reactkit';

const TooltipExample = () => (
  <Flexbox justify="center" padding="xl">
    <Tooltip content="This is a tooltip">
      <Button>Hover or focus me</Button>
    </Tooltip>
  </Flexbox>
);

export default TooltipExample;
`,
});

export const Controlled = LiveEditStory({
  component: Tooltip,
  code: `import React from 'react';
import { Flexbox, Tooltip, Button } from '@aknishi/akds-reactkit';

const TooltipExample = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Flexbox direction="column" align="center" gap="md" padding="xl">
      <Tooltip content="This is a controlled tooltip" open={open} onOpenChange={setOpen}>
        <Button>Hover or focus me</Button>
      </Tooltip>
      <Button appearance="bordered" emphasis="neutral" onClick={() => setOpen((prev) => !prev)}>
        Toggle programmatically
      </Button>
    </Flexbox>
  );
};

export default TooltipExample;
`,
});

export const Placements = LiveEditStory({
  component: Tooltip,
  code: `import { Flexbox, Tooltip, Button } from '@aknishi/akds-reactkit';

const TooltipExample = () => (
  <Flexbox justify="center" wrap gap="sm" padding="xl">
    <Tooltip content="Left tooltip" placement="left">
      <Button>Left</Button>
    </Tooltip>
    <Tooltip content="Top tooltip" placement="top">
      <Button>Top</Button>
    </Tooltip>
    <Tooltip content="Bottom tooltip" placement="bottom">
      <Button>Bottom</Button>
    </Tooltip>
    <Tooltip content="Right tooltip" placement="right">
      <Button>Right</Button>
    </Tooltip>
  </Flexbox>
);

export default TooltipExample;
`,
});
