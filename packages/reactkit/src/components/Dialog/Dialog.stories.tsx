import type { Meta } from '@storybook/react';
import { Dialog } from './Dialog';
import { LiveEditStory } from '../../utils/LiveEditStory';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
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
import { Dialog, Button } from '@akds/reactkit';

const DialogExample = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Dialog title">
        <p>This is the dialog body content.</p>
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <Button appearance="solid" sentiment="accented" onClick={() => setOpen(false)}>Confirm</Button>
          <Button appearance="bordered" sentiment="neutral" onClick={() => setOpen(false)}>Cancel</Button>
        </div>
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
import { Dialog, Button } from '@akds/reactkit';

const DialogExample = () => {
  const [size, setSize] = React.useState(null);
  return (
    <>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={() => setSize('sm')}>Small</Button>
        <Button onClick={() => setSize('md')}>Medium</Button>
        <Button onClick={() => setSize('lg')}>Large</Button>
      </div>
      <Dialog open={size !== null} onClose={() => setSize(null)} title="Dialog" size={size}>
        <p>A dialog with size "{size}".</p>
      </Dialog>
    </>
  );
};

export default DialogExample;
`,
});
