import type { Meta } from '@storybook/react-vite';
import { Dialog } from './Dialog';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Dialog> = {
  title: 'Reactkit/Dialog',
  component: Dialog,
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    open: { control: 'boolean' },
    title: { control: 'text' },
  },
};

export default meta;

export const Default = LiveEditStory({
  component: Dialog,
  code: `import React from 'react';
import { Flexbox, Dialog, Button } from '@aknishi/akds-reactkit';

const DialogExample = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Dialog title">
        <p>This is the dialog body content.</p>
        <Flexbox gap="sm" mt="md">
          <Button appearance="solid" emphasis="accented" onClick={() => setOpen(false)}>Confirm</Button>
          <Button appearance="bordered" emphasis="neutral" onClick={() => setOpen(false)}>Cancel</Button>
        </Flexbox>
      </Dialog>
    </>
  );
};

export default DialogExample;
`,
});

export const Sizes = LiveEditStory({
  component: Dialog,
  code: `import React from 'react';
import { Flexbox, Dialog, Button } from '@aknishi/akds-reactkit';

const DialogExample = () => {
  // size and open are separate state: size only changes when a size button
  // is clicked, and stays put while the dialog closes. Tying size to the
  // same state that drives "open" (e.g. open={size !== null}) clears size
  // the instant onClose fires, so the dialog loses its --sm/--md/--lg class
  // mid-close and visibly snaps to its default width during the animation.
  const [size, setSize] = React.useState('sm');
  const [open, setOpen] = React.useState(false);

  const openWithSize = (nextSize) => {
    setSize(nextSize);
    setOpen(true);
  };

  return (
    <>
      <Flexbox gap="sm">
        <Button onClick={() => openWithSize('sm')}>Small</Button>
        <Button onClick={() => openWithSize('md')}>Medium</Button>
        <Button onClick={() => openWithSize('lg')}>Large</Button>
      </Flexbox>
      <Dialog open={open} onClose={() => setOpen(false)} title="Dialog" size={size}>
        <p>A dialog with size "{size}".</p>
      </Dialog>
    </>
  );
};

export default DialogExample;
`,
});
