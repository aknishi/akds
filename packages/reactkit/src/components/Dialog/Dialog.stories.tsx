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
  const [size, setSize] = React.useState(null);
  return (
    <>
      <Flexbox gap="sm">
        <Button onClick={() => setSize('sm')}>Small</Button>
        <Button onClick={() => setSize('md')}>Medium</Button>
        <Button onClick={() => setSize('lg')}>Large</Button>
      </Flexbox>
      <Dialog open={size !== null} onClose={() => setSize(null)} title="Dialog" size={size}>
        <p>A dialog with size "{size}".</p>
      </Dialog>
    </>
  );
};

export default DialogExample;
`,
});
