import type { Meta } from '@storybook/react-vite';
import { Drawer } from './Drawer';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    side: { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
    open: { control: 'boolean' },
    title: { control: 'text' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Drawer,
  code: `import React from 'react';
import { Drawer, Button } from '@aknishi/akds-reactkit';

const DrawerExample = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Drawer" side="right">
        <p>Drawer content slides in from the right.</p>
      </Drawer>
    </>
  );
};

export default DrawerExample;
`,
});

export const Sides = LiveEditStory({
  component: Drawer,
  code: `import React from 'react';
import { Flexbox, Drawer, Button } from '@aknishi/akds-reactkit';

const DrawerExample = () => {
  const [side, setSide] = React.useState(null);
  return (
    <>
      <Flexbox gap="sm">
        <Button onClick={() => setSide('left')}>Left</Button>
        <Button onClick={() => setSide('right')}>Right</Button>
        <Button onClick={() => setSide('top')}>Top</Button>
        <Button onClick={() => setSide('bottom')}>Bottom</Button>
      </Flexbox>
      <Drawer open={side !== null} onClose={() => setSide(null)} title="Drawer" side={side}>
        <p>Sliding in from the {side}.</p>
      </Drawer>
    </>
  );
};

export default DrawerExample;
`,
});
